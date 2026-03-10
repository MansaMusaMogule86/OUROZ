import { describe, it, expect } from 'vitest';

/**
 * Tests for contact form validation logic.
 * Mirrors the validation in app/api/contact/route.ts without
 * importing Next.js server modules.
 */

function validateContact(body: Record<string, unknown>) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    const errors: string[] = [];
    if (!name || name.length < 2) errors.push('Name is required (min 2 characters)');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
    if (!message || message.length < 10) errors.push('Message is required (min 10 characters)');
    if (message.length > 5000) errors.push('Message is too long (max 5000 characters)');
    if (name.length > 200) errors.push('Name is too long (max 200 characters)');

    return errors;
}

describe('contact form validation', () => {
    const validBody = {
        name: 'Mehdi',
        email: 'mehdi@ouroz.com',
        message: 'This is a valid message with enough length.',
    };

    it('accepts valid input', () => {
        expect(validateContact(validBody)).toEqual([]);
    });

    it('rejects empty name', () => {
        const errors = validateContact({ ...validBody, name: '' });
        expect(errors).toContain('Name is required (min 2 characters)');
    });

    it('rejects single-char name', () => {
        const errors = validateContact({ ...validBody, name: 'M' });
        expect(errors).toContain('Name is required (min 2 characters)');
    });

    it('rejects name over 200 characters', () => {
        const errors = validateContact({ ...validBody, name: 'A'.repeat(201) });
        expect(errors).toContain('Name is too long (max 200 characters)');
    });

    it('rejects invalid email', () => {
        const errors = validateContact({ ...validBody, email: 'not-an-email' });
        expect(errors).toContain('Valid email is required');
    });

    it('rejects email without domain', () => {
        const errors = validateContact({ ...validBody, email: 'user@' });
        expect(errors).toContain('Valid email is required');
    });

    it('rejects empty email', () => {
        const errors = validateContact({ ...validBody, email: '' });
        expect(errors).toContain('Valid email is required');
    });

    it('accepts email with subdomain', () => {
        const errors = validateContact({ ...validBody, email: 'test@sub.domain.com' });
        expect(errors).toEqual([]);
    });

    it('rejects short message', () => {
        const errors = validateContact({ ...validBody, message: 'Hi' });
        expect(errors).toContain('Message is required (min 10 characters)');
    });

    it('rejects empty message', () => {
        const errors = validateContact({ ...validBody, message: '' });
        expect(errors).toContain('Message is required (min 10 characters)');
    });

    it('rejects message over 5000 characters', () => {
        const errors = validateContact({ ...validBody, message: 'A'.repeat(5001) });
        expect(errors).toContain('Message is too long (max 5000 characters)');
    });

    it('trims whitespace from inputs', () => {
        const errors = validateContact({
            name: '  Mehdi  ',
            email: '  mehdi@ouroz.com  ',
            message: '  A valid message with enough text.  ',
        });
        expect(errors).toEqual([]);
    });

    it('handles non-string values gracefully', () => {
        const errors = validateContact({ name: 123, email: null, message: undefined });
        expect(errors.length).toBeGreaterThanOrEqual(3);
    });

    it('collects multiple errors at once', () => {
        const errors = validateContact({ name: '', email: '', message: '' });
        expect(errors.length).toBe(3);
    });
});
