/**
 * OUROZ Supplier Profile Controller
 * Handles all supplier profile API business logic
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from '../../db/connection';
import { AppError } from '../../utils/errors';
import {
    GetProductsQuery,
    GetReviewsQuery,
    CreateReviewBody,
    ReportSupplierBody,
    UpdateSupplierBody,
    UpdateContactBody,
    AddGalleryBody,
    AddCertificationBody,
    ReviewResponseBody,
    UpdateVerificationBody,
    UpdateStatusBody,
} from './schemas';

// ============================================
// HELPER: Check supplier ownership
// ============================================

async function checkSupplierOwnership(supplierId: string, userId: string): Promise<boolean> {
    const result = await pool.query(
        'SELECT id FROM suppliers WHERE id = $1 AND user_id = $2',
        [supplierId, userId]
    );
    return result.rows.length > 0;
}

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * GET /api/suppliers/:id
 * Returns full public supplier profile
 */
export async function getSupplierProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Optional, for checking favorite status

        // Get supplier base data
        const supplierResult = await pool.query(`
            SELECT
                s.*,
                COALESCE(
                    (SELECT COUNT(*) FROM supplier_products WHERE supplier_id = s.id AND is_active = TRUE),
                    0
                ) as product_count
            FROM suppliers s
            WHERE s.id = $1 AND s.status = 'ACTIVE'
        `, [id]);

        if (supplierResult.rows.length === 0) {
            throw new AppError('Supplier not found', 404);
        }

        const supplier = supplierResult.rows[0];

        // Fetch related data in parallel
        const [
            categoriesResult,
            exportCountriesResult,
            certificationsResult,
            languagesResult,
            featuredProductsResult,
            favoriteResult,
        ] = await Promise.all([
            // Categories
            pool.query(`
                SELECT c.id, c.name, c.slug, sc.is_primary
                FROM supplier_categories sc
                JOIN categories c ON c.id = sc.category_id
                WHERE sc.supplier_id = $1
                ORDER BY sc.is_primary DESC, c.name
            `, [id]),

            // Export countries
            pool.query(`
                SELECT country_code
                FROM supplier_export_countries
                WHERE supplier_id = $1
            `, [id]),

            // Certifications
            pool.query(`
                SELECT id, name, issuer, icon, is_verified, issue_date, expiry_date
                FROM supplier_certifications
                WHERE supplier_id = $1
                ORDER BY is_verified DESC, name
            `, [id]),

            // Languages
            pool.query(`
                SELECT language_code, language_name, proficiency
                FROM supplier_languages
                WHERE supplier_id = $1
            `, [id]),

            // Featured products (limit 8)
            pool.query(`
                SELECT id, name, image_url, price_min, price_max, currency, moq, total_orders
                FROM supplier_products
                WHERE supplier_id = $1 AND is_active = TRUE AND is_featured = TRUE
                ORDER BY total_orders DESC
                LIMIT 8
            `, [id]),

            // Check if user favorited (only if authenticated)
            userId ? pool.query(`
                SELECT id FROM supplier_favorites WHERE supplier_id = $1 AND user_id = $2
            `, [id, userId]) : Promise.resolve({ rows: [] }),
        ]);

        // Transform response
        const response = {
            id: supplier.id,
            companyName: supplier.company_name,
            companyNameAr: supplier.company_name_ar,
            companyNameFr: supplier.company_name_fr,
            logo: supplier.logo_url,
            banner: supplier.banner_url,
            verificationLevel: supplier.verification_level,
            hasTradeAssurance: supplier.has_trade_assurance,
            tradeAssuranceLimit: parseFloat(supplier.trade_assurance_limit) || 0,

            companyType: supplier.company_type,
            yearEstablished: supplier.year_established,
            employeeCount: supplier.employee_count,
            annualRevenue: supplier.annual_revenue,

            region: supplier.region,
            city: supplier.city,
            fullAddress: supplier.full_address,

            exportCountries: exportCountriesResult.rows.map(r => r.country_code),
            exportExperience: supplier.export_experience_years,
            hasExportLicense: supplier.has_export_license,
            freeZoneCertified: supplier.free_zone_certified,

            certifications: certificationsResult.rows.map(c => ({
                id: c.id,
                name: c.name,
                issuer: c.issuer,
                icon: c.icon,
                isVerified: c.is_verified,
            })),

            mainCategories: categoriesResult.rows.map(c => c.name),
            productCount: parseInt(supplier.product_count) || 0,

            responseRate: parseFloat(supplier.response_rate) || 0,
            responseTime: supplier.avg_response_time_hours
                ? `< ${Math.ceil(supplier.avg_response_time_hours)} hours`
                : 'N/A',
            onTimeDelivery: parseFloat(supplier.on_time_delivery_rate) || 0,
            rating: {
                avg: parseFloat(supplier.rating_avg) || 0,
                count: supplier.rating_count || 0,
            },
            totalTransactions: supplier.total_transactions || 0,
            repeatBuyerRate: parseFloat(supplier.repeat_buyer_rate) || 0,

            description: supplier.description,
            videoUrl: supplier.video_url,

            contactName: supplier.contact_name,
            contactTitle: supplier.contact_title,
            languages: languagesResult.rows.map(l => l.language_name),

            featuredProducts: featuredProductsResult.rows.map(p => ({
                id: p.id,
                name: p.name,
                image: p.image_url,
                price: {
                    min: parseFloat(p.price_min) || 0,
                    max: parseFloat(p.price_max) || 0,
                },
                currency: p.currency,
                moq: p.moq,
                orders: p.total_orders,
            })),

            isFavorited: favoriteResult.rows.length > 0,
            createdAt: supplier.created_at,
        };

        res.json({ success: true, data: response });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/suppliers/:id/products
 * Returns paginated supplier products
 */
export async function getSupplierProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { page, limit, category, sort } = req.query as unknown as GetProductsQuery;

        const offset = (page - 1) * limit;

        // Build sort clause
        const sortMap: Record<string, string> = {
            popular: 'total_orders DESC',
            recent: 'created_at DESC',
            price_low: 'price_min ASC NULLS LAST',
            price_high: 'price_max DESC NULLS LAST',
        };
        const orderBy = sortMap[sort] || 'total_orders DESC';

        // Build query with optional category filter
        let whereClause = 'supplier_id = $1 AND is_active = TRUE';
        const params: (string | number)[] = [id];

        if (category) {
            whereClause += ' AND category_id = $2';
            params.push(category);
        }

        // Get total count
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM supplier_products WHERE ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get products
        const productsResult = await pool.query(`
            SELECT
                p.id, p.name, p.name_ar, p.name_fr, p.slug, p.description,
                p.image_url, p.price_min, p.price_max, p.currency, p.moq,
                p.total_orders, p.is_featured, p.created_at,
                c.name as category_name
            FROM supplier_products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.${whereClause}
            ORDER BY p.${orderBy}
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `, [...params, limit, offset]);

        res.json({
            success: true,
            data: {
                products: productsResult.rows.map(p => ({
                    id: p.id,
                    name: p.name,
                    nameAr: p.name_ar,
                    nameFr: p.name_fr,
                    slug: p.slug,
                    description: p.description,
                    image: p.image_url,
                    price: {
                        min: parseFloat(p.price_min) || 0,
                        max: parseFloat(p.price_max) || 0,
                        currency: p.currency,
                    },
                    moq: p.moq,
                    orders: p.total_orders,
                    isFeatured: p.is_featured,
                    category: p.category_name,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/suppliers/:id/reviews
 * Returns paginated supplier reviews
 */
export async function getSupplierReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { page, limit, rating, sort } = req.query as unknown as GetReviewsQuery;

        const offset = (page - 1) * limit;

        // Build sort clause
        const sortMap: Record<string, string> = {
            recent: 'r.created_at DESC',
            highest: 'r.rating DESC, r.created_at DESC',
            lowest: 'r.rating ASC, r.created_at DESC',
            helpful: 'r.created_at DESC', // TODO: Add helpful_count column
        };
        const orderBy = sortMap[sort] || 'r.created_at DESC';

        // Build query
        let whereClause = 'r.supplier_id = $1 AND r.is_visible = TRUE';
        const params: (string | number)[] = [id];

        if (rating) {
            whereClause += ` AND r.rating = $2`;
            params.push(rating);
        }

        // Get rating distribution
        const distributionResult = await pool.query(`
            SELECT rating, COUNT(*) as count
            FROM supplier_reviews
            WHERE supplier_id = $1 AND is_visible = TRUE
            GROUP BY rating
            ORDER BY rating DESC
        `, [id]);

        // Get total count
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM supplier_reviews r WHERE ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get reviews
        const reviewsResult = await pool.query(`
            SELECT
                r.id, r.rating, r.title, r.content,
                r.communication_rating, r.quality_rating, r.delivery_rating,
                r.is_verified_purchase, r.response, r.response_at, r.created_at,
                u.first_name, u.last_name, u.avatar_url
            FROM supplier_reviews r
            JOIN users u ON u.id = r.buyer_id
            WHERE ${whereClause}
            ORDER BY ${orderBy}
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `, [...params, limit, offset]);

        // Calculate distribution percentages
        const totalReviews = distributionResult.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
        const distribution = [5, 4, 3, 2, 1].map(star => {
            const found = distributionResult.rows.find(r => r.rating === star);
            const count = found ? parseInt(found.count) : 0;
            return {
                stars: star,
                count,
                percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
            };
        });

        res.json({
            success: true,
            data: {
                reviews: reviewsResult.rows.map(r => ({
                    id: r.id,
                    rating: r.rating,
                    title: r.title,
                    content: r.content,
                    detailedRatings: {
                        communication: r.communication_rating,
                        quality: r.quality_rating,
                        delivery: r.delivery_rating,
                    },
                    isVerifiedPurchase: r.is_verified_purchase,
                    response: r.response,
                    responseAt: r.response_at,
                    createdAt: r.created_at,
                    buyer: {
                        name: `${r.first_name || ''} ${r.last_name?.charAt(0) || ''}`.trim() || 'Anonymous',
                        avatar: r.avatar_url,
                    },
                })),
                distribution,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/suppliers/:id/gallery
 * Returns supplier gallery media
 */
export async function getSupplierGallery(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT id, media_type, url, thumbnail_url, title, description, is_featured
            FROM supplier_gallery
            WHERE supplier_id = $1
            ORDER BY is_featured DESC, sort_order ASC, created_at DESC
        `, [id]);

        res.json({
            success: true,
            data: result.rows.map(item => ({
                id: item.id,
                type: item.media_type,
                url: item.url,
                thumbnail: item.thumbnail_url,
                title: item.title,
                description: item.description,
                isFeatured: item.is_featured,
            })),
        });
    } catch (error) {
        next(error);
    }
}

// ============================================
// BUYER ENDPOINTS
// ============================================

/**
 * POST /api/suppliers/:id/favorite
 */
export async function addToFavorites(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        // Verify supplier exists and is active
        const supplierCheck = await pool.query(
            'SELECT id FROM suppliers WHERE id = $1 AND status = $2',
            [id, 'ACTIVE']
        );
        if (supplierCheck.rows.length === 0) {
            throw new AppError('Supplier not found', 404);
        }

        // Insert (ignore if already exists)
        await pool.query(`
            INSERT INTO supplier_favorites (supplier_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (supplier_id, user_id) DO NOTHING
        `, [id, userId]);

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/suppliers/:id/favorite
 */
export async function removeFromFavorites(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        await pool.query(
            'DELETE FROM supplier_favorites WHERE supplier_id = $1 AND user_id = $2',
            [id, userId]
        );

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/suppliers/:id/reviews
 */
export async function createReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const body = req.body as CreateReviewBody;

        // Check if user has already reviewed
        const existingReview = await pool.query(
            'SELECT id FROM supplier_reviews WHERE supplier_id = $1 AND buyer_id = $2',
            [id, userId]
        );
        if (existingReview.rows.length > 0) {
            throw new AppError('You have already reviewed this supplier', 400);
        }

        // Verify order if provided
        let isVerifiedPurchase = false;
        if (body.orderId) {
            const orderCheck = await pool.query(
                `SELECT id FROM orders WHERE id = $1 AND buyer_id = $2 AND supplier_id = $3 AND status = 'COMPLETED'`,
                [body.orderId, userId, id]
            );
            isVerifiedPurchase = orderCheck.rows.length > 0;
        }

        // Insert review
        const result = await pool.query(`
            INSERT INTO supplier_reviews (
                supplier_id, buyer_id, order_id, rating, title, content,
                communication_rating, quality_rating, delivery_rating,
                is_verified_purchase
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, created_at
        `, [
            id, userId, body.orderId || null, body.rating, body.title || null, body.content,
            body.communicationRating || null, body.qualityRating || null, body.deliveryRating || null,
            isVerifiedPurchase
        ]);

        res.status(201).json({
            success: true,
            data: {
                id: result.rows[0].id,
                createdAt: result.rows[0].created_at,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/suppliers/:id/report
 */
export async function reportSupplier(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const body = req.body as ReportSupplierBody;

        // Check for recent duplicate report
        const recentReport = await pool.query(`
            SELECT id FROM supplier_reports
            WHERE supplier_id = $1 AND reporter_id = $2
            AND created_at > NOW() - INTERVAL '24 hours'
        `, [id, userId]);

        if (recentReport.rows.length > 0) {
            throw new AppError('You have already reported this supplier recently', 400);
        }

        const result = await pool.query(`
            INSERT INTO supplier_reports (supplier_id, reporter_id, reason, description)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [id, userId, body.reason, body.description || null]);

        res.status(201).json({
            success: true,
            reportId: result.rows[0].id,
        });
    } catch (error) {
        next(error);
    }
}

// ============================================
// SUPPLIER ENDPOINTS
// ============================================

/**
 * PUT /api/suppliers/:id
 */
export async function updateSupplierProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const body = req.body as UpdateSupplierBody;

        // Verify ownership
        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only update your own profile', 403);
        }

        // Build dynamic update query
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        const fieldMap: Record<string, string> = {
            companyName: 'company_name',
            companyNameAr: 'company_name_ar',
            companyNameFr: 'company_name_fr',
            companyType: 'company_type',
            yearEstablished: 'year_established',
            employeeCount: 'employee_count',
            annualRevenue: 'annual_revenue',
            region: 'region',
            city: 'city',
            fullAddress: 'full_address',
            exportExperienceYears: 'export_experience_years',
            hasExportLicense: 'has_export_license',
            freeZoneCertified: 'free_zone_certified',
            description: 'description',
            videoUrl: 'video_url',
            logoUrl: 'logo_url',
            bannerUrl: 'banner_url',
        };

        for (const [key, column] of Object.entries(fieldMap)) {
            if (body[key as keyof UpdateSupplierBody] !== undefined) {
                updates.push(`${column} = $${paramIndex}`);
                values.push(body[key as keyof UpdateSupplierBody]);
                paramIndex++;
            }
        }

        if (updates.length > 0) {
            values.push(id);
            await pool.query(
                `UPDATE suppliers SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`,
                values
            );
        }

        // Update export countries if provided
        if (body.exportCountries) {
            await pool.query('DELETE FROM supplier_export_countries WHERE supplier_id = $1', [id]);
            if (body.exportCountries.length > 0) {
                const countryValues = body.exportCountries.map((code, i) =>
                    `($1, $${i + 2})`
                ).join(', ');
                await pool.query(
                    `INSERT INTO supplier_export_countries (supplier_id, country_code) VALUES ${countryValues}`,
                    [id, ...body.exportCountries]
                );
            }
        }

        // Update languages if provided
        if (body.languages) {
            await pool.query('DELETE FROM supplier_languages WHERE supplier_id = $1', [id]);
            if (body.languages.length > 0) {
                for (const lang of body.languages) {
                    await pool.query(
                        `INSERT INTO supplier_languages (supplier_id, language_code, language_name, proficiency)
                         VALUES ($1, $2, $3, $4)`,
                        [id, lang.code, lang.name, lang.proficiency || 'FLUENT']
                    );
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/suppliers/:id/contact
 */
export async function updateContact(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const body = req.body as UpdateContactBody;

        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only update your own profile', 403);
        }

        await pool.query(`
            UPDATE suppliers SET
                contact_name = $1,
                contact_title = $2,
                contact_email = $3,
                contact_phone = $4,
                updated_at = NOW()
            WHERE id = $5
        `, [body.contactName, body.contactTitle, body.contactEmail, body.contactPhone, id]);

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/suppliers/:id/gallery
 */
export async function addGalleryItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const body = req.body as AddGalleryBody;

        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only update your own gallery', 403);
        }

        // Limit gallery items
        const countResult = await pool.query(
            'SELECT COUNT(*) FROM supplier_gallery WHERE supplier_id = $1',
            [id]
        );
        if (parseInt(countResult.rows[0].count) >= 20) {
            throw new AppError('Maximum 20 gallery items allowed', 400);
        }

        const result = await pool.query(`
            INSERT INTO supplier_gallery (
                supplier_id, media_type, url, thumbnail_url, title, description, sort_order, is_featured
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `, [
            id, body.mediaType, body.url, body.thumbnailUrl || null,
            body.title || null, body.description || null, body.sortOrder || 0, body.isFeatured || false
        ]);

        res.status(201).json({
            success: true,
            data: { id: result.rows[0].id },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/suppliers/:id/gallery/:mediaId
 */
export async function removeGalleryItem(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, mediaId } = req.params;
        const userId = req.user!.id;

        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only update your own gallery', 403);
        }

        await pool.query(
            'DELETE FROM supplier_gallery WHERE id = $1 AND supplier_id = $2',
            [mediaId, id]
        );

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/suppliers/:id/certifications
 */
export async function addCertification(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const userId = req.user!.id;
        const body = req.body as AddCertificationBody;

        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only update your own certifications', 403);
        }

        const result = await pool.query(`
            INSERT INTO supplier_certifications (
                supplier_id, name, issuer, icon, certificate_number, issue_date, expiry_date, document_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `, [
            id, body.name, body.issuer, body.icon || null, body.certificateNumber || null,
            body.issueDate || null, body.expiryDate || null, body.documentUrl || null
        ]);

        res.status(201).json({
            success: true,
            data: { id: result.rows[0].id },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/suppliers/:id/certifications/:certId
 */
export async function removeCertification(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, certId } = req.params;
        const userId = req.user!.id;

        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only update your own certifications', 403);
        }

        await pool.query(
            'DELETE FROM supplier_certifications WHERE id = $1 AND supplier_id = $2',
            [certId, id]
        );

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/suppliers/:id/reviews/:reviewId/response
 */
export async function respondToReview(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, reviewId } = req.params;
        const userId = req.user!.id;
        const body = req.body as ReviewResponseBody;

        if (!(await checkSupplierOwnership(id, userId))) {
            throw new AppError('You can only respond to reviews on your own profile', 403);
        }

        const result = await pool.query(`
            UPDATE supplier_reviews
            SET response = $1, response_at = NOW(), updated_at = NOW()
            WHERE id = $2 AND supplier_id = $3
            RETURNING id
        `, [body.response, reviewId, id]);

        if (result.rows.length === 0) {
            throw new AppError('Review not found', 404);
        }

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * PUT /api/suppliers/:id/verification
 */
export async function updateVerificationLevel(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const body = req.body as UpdateVerificationBody;

        await pool.query(`
            UPDATE suppliers
            SET verification_level = $1, verified_at = NOW(), updated_at = NOW()
            WHERE id = $2
        `, [body.level, id]);

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/suppliers/:id/status
 */
export async function updateSupplierStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const body = req.body as UpdateStatusBody;

        await pool.query(`
            UPDATE suppliers SET status = $1, updated_at = NOW() WHERE id = $2
        `, [body.status, id]);

        // TODO: Log status change with reason

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/suppliers/:id/certifications/:certId/verify
 */
export async function verifyCertification(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, certId } = req.params;
        const { isVerified } = req.body;
        const adminId = req.user!.id;

        await pool.query(`
            UPDATE supplier_certifications
            SET is_verified = $1, verified_at = $2, verified_by = $3, updated_at = NOW()
            WHERE id = $4 AND supplier_id = $5
        `, [isVerified, isVerified ? new Date() : null, isVerified ? adminId : null, certId, id]);

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}
