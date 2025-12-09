import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import prisma from '@/lib/prisma'
import ProductDetailClient from '@/components/ProductDetailClient'

interface Props {
    params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: slug },
            include: {
                brand: true,
                category: true,
                images: true,
                variants: true,
                inventory: true
            },
        })
        return product
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        return { title: 'Product Not Found | Burhani Associates' }
    }

    const title = `${product.name} | Burhani Associates`
    const description = product.description
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 160) // Strip HTML for SEO description
        : `Buy ${product.name} - Authorized Dealer for ${product.brand?.name || 'Industrial Components'} in Hyderabad.`

    const images = product.images.map(img => img.url)

    return {
        title,
        description,
        keywords: [
            product.name,
            product.brand?.name || '',
            product.category?.name || '',
            'Industrial Components',
            'Hyderabad',
            'Burhani Associates',
        ].filter(Boolean),
        openGraph: {
            title,
            description,
            type: 'website', // or 'article'/'product' if available in Next.js metadata types properly, 'website' is safe default
            url: `https://burhaniassociates.com/products/${product.id}`,
            images: images.length > 0 ? images : undefined,
            siteName: 'Burhani Associates',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images.length > 0 ? images : undefined,
        },
        alternates: {
            canonical: `https://burhaniassociates.com/products/${product.id}`,
        }
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-bold text-primary mb-4">Product Not Found</h1>
                    <Link href="/products" className="btn btn-primary">Return to Catalog</Link>
                </div>
            </div>
        )
    }

    const displayProduct = { name: product.name }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Breadcrumb Strip */}
            <div className="bg-white border-b border-border shadow-sm">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-xs lg:text-sm font-bold text-muted-foreground uppercase tracking-widest overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                        <span>/</span>
                        {product.category && (
                            <>
                                <Link href={`/products?category=${product.category.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors">
                                    {product.category.name}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-primary">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Image Area */}
                    <div className="relative bg-white border border-border p-8 lg:p-16 flex items-center justify-center shadow-lg group">
                        {/* Decorative Corner Accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent" />

                        <div className="relative w-full aspect-square max-w-[500px]">
                            {product.images[0]?.url ? (
                                <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-secondary/10">
                                    <span className="text-muted-foreground font-bold uppercase tracking-widest">No Image Available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="flex flex-col h-full">
                        {/* Brand Badge */}
                        <div className="mb-6">
                            {product.brand && (
                                <Link
                                    href={`/products?brand=${product.brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-md"
                                >
                                    <span>Authorized {product.brand.name} Dealer</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl lg:text-5xl font-heading font-bold text-primary mb-6 leading-tight uppercase">
                            {product.name}
                        </h1>

                        {/* Description */}
                        <div className="bg-white p-8 border-l-4 border-accent shadow-sm mb-8">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Technical Description</h3>
                            <div
                                className="prose prose-slate max-w-none text-secondary-foreground/80 font-sans leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.description || '<p>Contact us for detailed technical specifications.</p>' }}
                            />
                        </div>

                        {/* Spacer */}
                        <div className="flex-grow" />

                        {/* Interaction Area */}
                        <div className="mt-8 space-y-8">
                            {/* Actions */}
                            <div className="bg-white p-6 border border-border shadow-md">
                                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 border-b border-border pb-2">Request Quote</h3>
                                <ProductDetailClient product={displayProduct} />
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-border">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wide">100% Genuine</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-secondary/10 border border-border">
                                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wide">Fast Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
