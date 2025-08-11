-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Address (
  id uuid NOT NULL,
  userId uuid,
  label text,
  fullName text NOT NULL,
  line1 text NOT NULL,
  line2 text,
  city text NOT NULL,
  region text,
  postalCode text,
  countryCode text NOT NULL,
  phone text,
  isDefaultShip boolean NOT NULL DEFAULT false,
  isDefaultBill boolean NOT NULL DEFAULT false,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Address_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Cart (
  id uuid NOT NULL,
  userId uuid NOT NULL,
  isActive boolean NOT NULL DEFAULT true,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Cart_pkey PRIMARY KEY (id)
);
CREATE TABLE public.CartItem (
  id uuid NOT NULL,
  cartId uuid NOT NULL,
  variantId uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unitPrice numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  productName text NOT NULL,
  sku text NOT NULL,
  imageUrl text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT CartItem_pkey PRIMARY KEY (id),
  CONSTRAINT CartItem_cartId_fkey FOREIGN KEY (cartId) REFERENCES public.Cart(id),
  CONSTRAINT CartItem_variantId_fkey FOREIGN KEY (variantId) REFERENCES public.ProductVariant(id)
);
CREATE TABLE public.Category (
  id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  imageUrl text,
  isActive boolean NOT NULL DEFAULT true,
  parentId uuid,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  color text,
  displayName text,
  icon text,
  isFeatured boolean NOT NULL DEFAULT false,
  showInFooter boolean NOT NULL DEFAULT false,
  showInNavigation boolean NOT NULL DEFAULT true,
  sortOrder integer NOT NULL DEFAULT 0,
  CONSTRAINT Category_pkey PRIMARY KEY (id),
  CONSTRAINT Category_parentId_fkey FOREIGN KEY (parentId) REFERENCES public.Category(id)
);
CREATE TABLE public.Collection (
  id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  imageUrl text,
  isFeatured boolean NOT NULL DEFAULT false,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Collection_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Coupon (
  id uuid NOT NULL,
  code text NOT NULL,
  description text,
  type USER-DEFINED NOT NULL DEFAULT 'PERCENTAGE'::"DiscountType",
  value numeric NOT NULL,
  maxDiscount numeric,
  startsAt timestamp without time zone,
  endsAt timestamp without time zone,
  usageLimit integer,
  usageCount integer NOT NULL DEFAULT 0,
  isActive boolean NOT NULL DEFAULT true,
  metadata jsonb,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Coupon_pkey PRIMARY KEY (id)
);
CREATE TABLE public.CouponRedemption (
  id uuid NOT NULL,
  couponId uuid NOT NULL,
  orderId uuid NOT NULL,
  amount numeric NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT CouponRedemption_pkey PRIMARY KEY (id),
  CONSTRAINT CouponRedemption_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.Order(id),
  CONSTRAINT CouponRedemption_couponId_fkey FOREIGN KEY (couponId) REFERENCES public.Coupon(id)
);
CREATE TABLE public.InventoryTransaction (
  id uuid NOT NULL,
  variantId uuid NOT NULL,
  delta integer NOT NULL,
  reason USER-DEFINED NOT NULL DEFAULT 'ADJUSTMENT'::"InventoryReason",
  reference text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT InventoryTransaction_pkey PRIMARY KEY (id),
  CONSTRAINT InventoryTransaction_variantId_fkey FOREIGN KEY (variantId) REFERENCES public.ProductVariant(id)
);
CREATE TABLE public.Order (
  id uuid NOT NULL,
  userId uuid NOT NULL,
  number text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::"OrderStatus",
  paymentStatus USER-DEFINED NOT NULL DEFAULT 'PAYMENT_PENDING'::"PaymentStatus",
  currency text NOT NULL DEFAULT 'USD'::text,
  subtotal numeric NOT NULL,
  tax numeric NOT NULL,
  shipping numeric NOT NULL,
  discount numeric NOT NULL,
  total numeric NOT NULL,
  shippingAddressId uuid,
  billingAddressId uuid,
  placedAt timestamp without time zone,
  notes text,
  metadata jsonb,
  paymentProvider text,
  paymentIntentId text,
  paymentData jsonb,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Order_pkey PRIMARY KEY (id),
  CONSTRAINT Order_billingAddressId_fkey FOREIGN KEY (billingAddressId) REFERENCES public.Address(id),
  CONSTRAINT Order_shippingAddressId_fkey FOREIGN KEY (shippingAddressId) REFERENCES public.Address(id)
);
CREATE TABLE public.OrderItem (
  id uuid NOT NULL,
  orderId uuid NOT NULL,
  productId uuid,
  variantId uuid,
  quantity integer NOT NULL,
  unitPrice numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  productName text NOT NULL,
  sku text NOT NULL,
  imageUrl text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT OrderItem_pkey PRIMARY KEY (id),
  CONSTRAINT OrderItem_variantId_fkey FOREIGN KEY (variantId) REFERENCES public.ProductVariant(id),
  CONSTRAINT OrderItem_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.Order(id),
  CONSTRAINT OrderItem_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);
CREATE TABLE public.Payment (
  id uuid NOT NULL,
  orderId uuid NOT NULL,
  provider text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PAYMENT_PENDING'::"PaymentStatus",
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD'::text,
  transactionId text,
  data jsonb,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Payment_pkey PRIMARY KEY (id),
  CONSTRAINT Payment_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.Order(id)
);
CREATE TABLE public.Product (
  id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  details jsonb,
  status USER-DEFINED NOT NULL DEFAULT 'DRAFT'::"ProductStatus",
  brand text,
  categoryId uuid,
  currency text NOT NULL DEFAULT 'USD'::text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  isActive boolean NOT NULL DEFAULT true,
  isBestseller boolean NOT NULL DEFAULT false,
  isFeatured boolean NOT NULL DEFAULT false,
  isNewArrival boolean NOT NULL DEFAULT false,
  isOnSale boolean NOT NULL DEFAULT false,
  metaDescription text,
  metaKeywords text,
  metaTitle text,
  shortDescription text,
  CONSTRAINT Product_pkey PRIMARY KEY (id),
  CONSTRAINT Product_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES public.Category(id)
);
CREATE TABLE public.ProductCollection (
  productId uuid NOT NULL,
  collectionId uuid NOT NULL,
  sortOrder integer NOT NULL DEFAULT 0,
  CONSTRAINT ProductCollection_pkey PRIMARY KEY (productId, collectionId),
  CONSTRAINT ProductCollection_collectionId_fkey FOREIGN KEY (collectionId) REFERENCES public.Collection(id),
  CONSTRAINT ProductCollection_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);
CREATE TABLE public.ProductImage (
  id uuid NOT NULL,
  productId uuid NOT NULL,
  url text NOT NULL,
  alt text,
  isPrimary boolean NOT NULL DEFAULT false,
  sortOrder integer NOT NULL DEFAULT 0,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT ProductImage_pkey PRIMARY KEY (id),
  CONSTRAINT ProductImage_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);
CREATE TABLE public.ProductTag (
  productId uuid NOT NULL,
  tagId uuid NOT NULL,
  CONSTRAINT ProductTag_pkey PRIMARY KEY (productId, tagId),
  CONSTRAINT ProductTag_tagId_fkey FOREIGN KEY (tagId) REFERENCES public.Tag(id),
  CONSTRAINT ProductTag_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);
CREATE TABLE public.ProductVariant (
  id uuid NOT NULL,
  productId uuid NOT NULL,
  sku text NOT NULL,
  title text,
  price numeric NOT NULL,
  compareAtPrice numeric,
  currency text NOT NULL DEFAULT 'USD'::text,
  stock integer NOT NULL DEFAULT 0,
  isDefault boolean NOT NULL DEFAULT false,
  attributes jsonb NOT NULL,
  barcode text,
  weightGrams integer,
  lengthCm integer,
  widthCm integer,
  heightCm integer,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT ProductVariant_pkey PRIMARY KEY (id),
  CONSTRAINT ProductVariant_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);
CREATE TABLE public.Profile (
  id uuid NOT NULL,
  userId uuid NOT NULL,
  displayName text,
  avatarUrl text,
  phone text,
  isAdmin boolean NOT NULL DEFAULT false,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Profile_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Review (
  id uuid NOT NULL,
  productId uuid NOT NULL,
  userId uuid NOT NULL,
  rating integer NOT NULL,
  title text,
  content text,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::"ReviewStatus",
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Review_pkey PRIMARY KEY (id),
  CONSTRAINT Review_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);
CREATE TABLE public.Shipment (
  id uuid NOT NULL,
  orderId uuid NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'LABEL_CREATED'::"ShipmentStatus",
  carrier text,
  trackingNumber text,
  shippedAt timestamp without time zone,
  deliveredAt timestamp without time zone,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Shipment_pkey PRIMARY KEY (id),
  CONSTRAINT Shipment_orderId_fkey FOREIGN KEY (orderId) REFERENCES public.Order(id)
);
CREATE TABLE public.Tag (
  id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Tag_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Wishlist (
  id uuid NOT NULL,
  userId uuid NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  CONSTRAINT Wishlist_pkey PRIMARY KEY (id)
);
CREATE TABLE public.WishlistItem (
  id uuid NOT NULL,
  wishlistId uuid NOT NULL,
  productId uuid NOT NULL,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT WishlistItem_pkey PRIMARY KEY (id),
  CONSTRAINT WishlistItem_wishlistId_fkey FOREIGN KEY (wishlistId) REFERENCES public.Wishlist(id),
  CONSTRAINT WishlistItem_productId_fkey FOREIGN KEY (productId) REFERENCES public.Product(id)
);