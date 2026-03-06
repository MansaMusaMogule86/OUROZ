'use client';
/**
 * OUROZ – Language Context
 * Controls AR/FR/EN for the entire shop section.
 * Preference stored in localStorage + cookie for SSR.
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import type { LangCode } from '@/types/shop';

// =====================================================
// TRANSLATIONS - UI strings
// =====================================================

export const UI_STRINGS: Record<LangCode, Record<string, string>> = {
    en: {
        shopForHome: 'Shop for Home',
        forBusinesses: 'For Businesses',
        addToCart: 'Add to Cart',
        addingToCart: 'Adding…',
        addedToCart: 'Added!',
        requestBulkQuote: 'Request Bulk Quote',
        outOfStock: 'Out of Stock',
        lowStock: 'Low Stock',
        moq: 'Min. Order',
        qty: 'Qty',
        price: 'Price',
        total: 'Total',
        cart: 'Cart',
        cartEmpty: 'Your cart is empty.',
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
        wholesale: 'Wholesale',
        applyForWholesale: 'Apply for Wholesale Access',
        wholesalePending: 'Application under review',
        wholesaleRejected: 'Application was not approved',
        tierPricing: 'Wholesale Tier Pricing',
        fromPrice: 'From',
        viewAll: 'View All',
        featured: 'Featured',
        search: 'Search products…',
        searchAr: 'Search in Arabic too',
        noResults: 'No products found.',
        loading: 'Loading…',
        error: 'Something went wrong.',
        businessName: 'Business Name',
        tradeLicense: 'Trade License Number',
        contactEmail: 'Contact Email',
        contactPhone: 'Contact Phone',
        businessType: 'Business Type',
        submit: 'Submit Application',
        units: 'units',
        perUnit: 'per unit',
        gallery: 'Gallery',
        description: 'Description',
    },
    ar: {
        shopForHome: 'تسوق للمنزل',
        forBusinesses: 'للأعمال',
        addToCart: 'أضف إلى السلة',
        addingToCart: 'جاري الإضافة…',
        addedToCart: 'تمت الإضافة!',
        requestBulkQuote: 'طلب عرض سعر بالجملة',
        outOfStock: 'نفد المخزون',
        lowStock: 'مخزون منخفض',
        moq: 'الحد الأدنى للطلب',
        qty: 'الكمية',
        price: 'السعر',
        total: 'المجموع',
        cart: 'السلة',
        cartEmpty: 'سلتك فارغة.',
        checkout: 'الدفع',
        continueShopping: 'مواصلة التسوق',
        wholesale: 'الجملة',
        applyForWholesale: 'التقدم للوصول بالجملة',
        wholesalePending: 'الطلب قيد المراجعة',
        wholesaleRejected: 'لم يتم قبول الطلب',
        tierPricing: 'أسعار الجملة حسب الكمية',
        fromPrice: 'من',
        viewAll: 'عرض الكل',
        featured: 'مميز',
        search: '…ابحث عن منتجات',
        searchAr: 'ابحث بالعربية أيضاً',
        noResults: 'لا توجد منتجات.',
        loading: 'جاري التحميل…',
        error: 'حدث خطأ.',
        businessName: 'اسم الشركة',
        tradeLicense: 'رقم الرخصة التجارية',
        contactEmail: 'البريد الإلكتروني',
        contactPhone: 'رقم الهاتف',
        businessType: 'نوع النشاط التجاري',
        submit: 'إرسال الطلب',
        units: 'وحدات',
        perUnit: 'لكل وحدة',
        gallery: 'معرض الصور',
        description: 'الوصف',
    },
    fr: {
        shopForHome: 'Acheter pour la Maison',
        forBusinesses: 'Pour les Entreprises',
        addToCart: 'Ajouter au panier',
        addingToCart: 'Ajout en cours…',
        addedToCart: 'Ajouté !',
        requestBulkQuote: 'Demander un Devis en Gros',
        outOfStock: 'En rupture de stock',
        lowStock: 'Stock faible',
        moq: 'Quantité min.',
        qty: 'Qté',
        price: 'Prix',
        total: 'Total',
        cart: 'Panier',
        cartEmpty: 'Votre panier est vide.',
        checkout: 'Commander',
        continueShopping: 'Continuer les achats',
        wholesale: 'Gros',
        applyForWholesale: "Demander l'accès en gros",
        wholesalePending: "Demande en cours d'examen",
        wholesaleRejected: 'Demande non approuvée',
        tierPricing: 'Grille de prix en gros',
        fromPrice: 'À partir de',
        viewAll: 'Voir tout',
        featured: 'En vedette',
        search: 'Rechercher des produits…',
        searchAr: 'Chercher en arabe aussi',
        noResults: 'Aucun produit trouvé.',
        loading: 'Chargement…',
        error: 'Une erreur est survenue.',
        businessName: "Nom de l'entreprise",
        tradeLicense: 'N° de licence commerciale',
        contactEmail: 'Email de contact',
        contactPhone: 'Téléphone de contact',
        businessType: "Type d'activité",
        submit: 'Soumettre la demande',
        units: 'unités',
        perUnit: 'par unité',
        gallery: 'Galerie',
        description: 'Description',
    },
};

// =====================================================
// CONTEXT
// =====================================================

interface LangContextValue {
    lang: LangCode;
    setLang: (lang: LangCode) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<LangCode>('en');

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('ouroz_lang') as LangCode | null;
        if (stored && ['en', 'ar', 'fr'].includes(stored)) {
            setLangState(stored);
        }
    }, []);

    const setLang = useCallback((newLang: LangCode) => {
        setLangState(newLang);
        localStorage.setItem('ouroz_lang', newLang);
        // Also set cookie for SSR (1 year)
        document.cookie = `ouroz_lang=${newLang};path=/;max-age=31536000;SameSite=Lax`;
        // Set HTML dir for RTL
        document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', newLang);
    }, []);

    const t = useCallback(
        (key: string) => UI_STRINGS[lang][key] ?? UI_STRINGS.en[key] ?? key,
        [lang]
    );

    return (
        <LangContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error('useLang must be used inside LangProvider');
    return ctx;
}
