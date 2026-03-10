# \# QA\_RELEASE\_CHECKLIST.md

# 

# A release is blocked until every relevant item below is verified.

# 

# \## Storefront

# 1\. Browse categories works

# 2\. Search products works

# 3\. Product page opens correctly

# 4\. Add to cart works

# 5\. Checkout works

# 6\. Order confirmation works

# 

# \## Auth

# 1\. Sign up works

# 2\. Log in works

# 3\. Reset password works

# 4\. Role based access works correctly

# 

# \## Supplier

# 1\. Supplier registration works

# 2\. Supplier dashboard loads correctly

# 3\. Supplier can create product

# 4\. Supplier can manage orders

# 5\. Public supplier profile opens correctly

# 

# \## Admin

# 1\. Admin routes are blocked for non admin users

# 2\. Suppliers page uses live data

# 3\. Businesses page uses live data

# 4\. Subscriptions page uses live data

# 5\. Invoices page uses live data

# 6\. Credit page uses live data

# 7\. Risk page uses live data

# 

# \## Business and Wholesale

# 1\. Wholesale dashboard uses live data

# 2\. Business dashboard uses live data

# 3\. Business invoices use live data

# 4\. Business subscription uses live data

# 

# \## Trade OS

# 1\. RFQ list and detail work

# 2\. Supplier discovery works

# 3\. Price intelligence loads real data

# 4\. Logistics tracker works

# 5\. Compliance vault works

# 6\. Deal negotiation persists data

# 7\. AI features degrade gracefully if provider fails

# 

# \## Security

# 1\. Stripe webhook rejects invalid signatures

# 2\. Privileged pages require auth and correct role

# 3\. RLS blocks unauthorized reads and writes

# 4\. Rate limiting triggers on abuse paths

# 5\. Contact form submission is validated

# 

# \## Quality

# 1\. Error boundaries render fallback UI

# 2\. Skeletons appear during loading

# 3\. Toast feedback appears after key actions

# 4\. Metadata is present on major pages

# 5\. Images are optimized

# 6\. Build passes

# 7\. Lint passes

# 8\. Tests pass

# 9\. E2E passes

# 

# \## Release rule

# 1\. Any unchecked item blocks release

# 2\. Any mocked production path blocks release

# 3\. Any broken auth, payment, live data, or Trade OS flow blocks release

# 4\. Remaining issues must be stated explicitly

