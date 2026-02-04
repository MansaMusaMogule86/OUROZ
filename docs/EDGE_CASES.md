# OUROZ Supplier Profile - Edge Cases Handling

## 1. Missing Data

### Supplier Profile
| Field | Default Behavior |
|-------|-----------------|
| `logo` | Generate avatar from company name using `ui-avatars.com` |
| `banner` | Show generic Moroccan landscape placeholder |
| `description` | Display "No description provided" message |
| `videoUrl` | Hide video section entirely |
| `contactName` | Show "Contact not available" |
| `certifications[]` | Show "No certifications listed" message |
| `exportCountries[]` | Show "No export countries listed" message |
| `featuredProducts[]` | Show "No products listed yet" message |
| `rating.count = 0` | Display "No reviews yet" with empty stars |

### Frontend Handling
```tsx
// Example: Null-safe rendering
{supplier.description ? (
    <p>{supplier.description}</p>
) : (
    <p className="text-gray-400 italic">No description provided.</p>
)}

// Example: Empty array check
{products.length > 0 ? (
    <ProductGrid products={products} />
) : (
    <EmptyState message="No products listed yet." />
)}
```

---

## 2. Unauthorized Access

### Scenario Handling

| Scenario | Response | Frontend Action |
|----------|----------|-----------------|
| View profile (no auth) | ✅ Allow | Show profile without favorite status |
| Favorite without auth | 401 | Redirect to login, preserve action |
| Write review without auth | 401 | Redirect to login with return URL |
| Edit non-owned profile | 403 | Show "Permission denied" toast |
| Suspended supplier profile | 404 | Show "Supplier not found" |
| Admin action as buyer | 403 | Hide admin controls in UI |

### Backend Implementation
```typescript
// Check ownership before mutation
if (!(await checkSupplierOwnership(id, userId))) {
    throw new AppError('You can only update your own profile', 403);
}

// Check supplier status before showing
const supplier = await pool.query(
    'SELECT * FROM suppliers WHERE id = $1 AND status = $2',
    [id, 'ACTIVE']
);
if (supplier.rows.length === 0) {
    throw new AppError('Supplier not found', 404);
}
```

### Frontend Auth Guard
```tsx
// Wrap protected actions
const handleFavorite = async () => {
    if (!isAuthenticated) {
        saveIntendedAction('favorite', supplierId);
        navigate('/login?return=' + encodeURIComponent(location.pathname));
        return;
    }
    await toggleFavorite(supplierId, isFavorited);
};
```

---

## 3. Invalid Input

### Validation Rules (Server-side)

| Field | Validation | Error Message |
|-------|-----------|---------------|
| `rating` | 1-5 integer | "Rating must be between 1 and 5" |
| `content` (review) | 10-2000 chars | "Review must be 10-2000 characters" |
| `reason` (report) | enum values only | "Invalid report reason" |
| `supplierId` | valid UUID | "Invalid supplier ID format" |
| `yearEstablished` | 1900-current year | "Invalid year" |
| `exportCountries` | ISO 3166-1 alpha-2 | "Invalid country code" |
| `email` | valid email format | "Invalid email format" |
| `url` | valid URL format | "Invalid URL format" |

### Zod Schema Validation
```typescript
// Server validates with Zod before processing
export const createReviewBody = z.object({
    rating: z.number().int().min(1).max(5),
    content: z.string().min(10).max(2000),
    // ... other fields
});

// Middleware applies validation
export function validateRequest(schema: ZodSchema, target: 'body' | 'query' = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return next(new AppError(
                result.error.errors.map(e => e.message).join(', '),
                400,
                'VALIDATION_ERROR'
            ));
        }
        req[target] = result.data; // Use validated/transformed data
        next();
    };
}
```

### Frontend Validation
```tsx
// Validate before submit
const handleSubmitReview = async (data: ReviewFormData) => {
    // Client-side validation
    if (data.rating < 1 || data.rating > 5) {
        setError('rating', 'Rating must be between 1 and 5');
        return;
    }
    if (data.content.length < 10) {
        setError('content', 'Review must be at least 10 characters');
        return;
    }

    // Submit to API
    const result = await createReview(supplierId, data);
    if (!result.success) {
        toast.error(result.error || 'Failed to submit review');
    }
};
```

---

## 4. Abuse Prevention

### Rate Limiting

| Action | Limit | Window | Implementation |
|--------|-------|--------|----------------|
| View profile | 100 req | 1 min | IP-based |
| API general | 60 req | 1 min | Token/IP-based |
| Create review | 1 | per supplier | DB constraint |
| Report supplier | 1 | 24 hours | DB + timestamp check |
| Add favorite | 50 | 1 hour | Token-based |
| Contact supplier | 10 | 1 hour | Token-based |

### Database Constraints
```sql
-- Prevent duplicate reviews
UNIQUE(supplier_id, buyer_id) ON supplier_reviews;

-- Prevent duplicate favorites
UNIQUE(supplier_id, user_id) ON supplier_favorites;

-- Check recent reports
SELECT id FROM supplier_reports
WHERE supplier_id = $1 AND reporter_id = $2
AND created_at > NOW() - INTERVAL '24 hours';
```

### Content Moderation

| Type | Check | Action |
|------|-------|--------|
| Review content | Profanity filter | Reject with message |
| Review content | Spam detection | Flag for review |
| Gallery images | Size limit (5MB) | Reject upload |
| Gallery count | Max 20 items | Reject with message |
| Description | Max 5000 chars | Truncate on submit |

### Implementation
```typescript
// Report rate limiting
const recentReport = await pool.query(`
    SELECT id FROM supplier_reports
    WHERE supplier_id = $1 AND reporter_id = $2
    AND created_at > NOW() - INTERVAL '24 hours'
`, [id, userId]);

if (recentReport.rows.length > 0) {
    throw Errors.REPORT_RATE_LIMITED();
}

// Gallery limit
const countResult = await pool.query(
    'SELECT COUNT(*) FROM supplier_gallery WHERE supplier_id = $1',
    [id]
);
if (parseInt(countResult.rows[0].count) >= 20) {
    throw Errors.GALLERY_LIMIT();
}
```

---

## 5. Network & Loading States

### Frontend State Management

```tsx
// Loading skeleton example
if (loading) {
    return (
        <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4" />
            <div className="h-6 bg-gray-200 w-1/2 rounded mb-2" />
            <div className="h-4 bg-gray-200 w-3/4 rounded" />
        </div>
    );
}

// Error retry mechanism
if (error) {
    return (
        <ErrorState
            message={error}
            onRetry={refetch}
        />
    );
}

// Optimistic updates for favorites
const handleFavorite = async () => {
    const previousState = isFavorited;
    setIsFavorited(!isFavorited); // Optimistic

    const success = await toggleFavorite(supplierId, previousState);
    if (!success) {
        setIsFavorited(previousState); // Revert on failure
        toast.error('Failed to update favorite');
    }
};
```

---

## 6. Concurrent Access

### Scenarios

| Scenario | Solution |
|----------|----------|
| Two users review same supplier | Second gets "already reviewed" error |
| Admin + supplier edit same time | Last write wins (updated_at tracks) |
| Supplier deleted while viewing | 404 on next action, stale UI shows warning |
| Rating update during review submit | Trigger recalculates rating |

### Database Triggers
```sql
-- Auto-recalculate rating after review changes
CREATE TRIGGER trigger_recalculate_rating
AFTER INSERT OR UPDATE OR DELETE ON supplier_reviews
FOR EACH ROW EXECUTE FUNCTION recalculate_supplier_rating();
```

---

## 7. Data Consistency

### Cached vs Fresh Data

| Data | Caching Strategy | Invalidation |
|------|-----------------|--------------|
| Supplier profile | 5 min client cache | On profile update |
| Products list | 2 min client cache | On product CRUD |
| Reviews | 1 min client cache | On new review |
| Rating stats | Calculated on trigger | Auto via DB trigger |
| Favorite status | No cache | Always fresh |

### Soft Deletes
```sql
-- Suppliers are never hard deleted
UPDATE suppliers SET status = 'SUSPENDED' WHERE id = $1;

-- Reviews can be hidden but not deleted
UPDATE supplier_reviews SET is_visible = FALSE WHERE id = $1;
```

---

## 8. Localization Edge Cases

| Scenario | Handling |
|----------|----------|
| Missing Arabic name | Fallback to English name |
| RTL layout | CSS `dir="rtl"` on container |
| Number formatting | Use `toLocaleString()` with locale |
| Date formatting | Use `Intl.DateTimeFormat` |
| Empty translated content | Show original + "Translation pending" badge |

```tsx
const getLocalizedName = (supplier: SupplierProfile, lang: Language) => {
    if (lang === 'ar' && supplier.companyNameAr) return supplier.companyNameAr;
    if (lang === 'fr' && supplier.companyNameFr) return supplier.companyNameFr;
    return supplier.companyName; // Default fallback
};
```
