import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

// Types
interface ProductType {
    id: string
    name: string
    slug: string
    description: string | null
    featured: boolean
    imageUrl: string | null
    images: { url: string }[]
    brand: { id: string, name: string } | null
    category: { id: string, name: string } | null
}

async function getProducts() {
    try {
        const products = await prisma.product.findMany({
            include: {
                brand: true,
                category: true,
                images: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return products
    } catch (error) {
        console.error('Error fetching products:', error)
        return [] as any[]
    }
}

async function getBrands() {
    try {
        return await prisma.brand.findMany({ select: { id: true, name: true } })
    } catch {
        return [] as { id: string; name: string }[]
    }
}

async function getCategories() {
    try {
        return await prisma.category.findMany({ select: { id: true, name: true } })
    } catch {
        return [] as { id: string; name: string }[]
    }
}

interface PageProps {
    searchParams: Promise<{
        brand?: string
        category?: string
        search?: string
    }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams
    const products = await getProducts()
    const brands = await getBrands()
    const categories = await getCategories()

    // Filter Logic
    let displayProducts = products
    if (params.brand) {
        const brandSlug = params.brand.toLowerCase()
        displayProducts = displayProducts.filter(
            (p: any) => p.brand?.name.toLowerCase().replace(/\s+/g, '-') === brandSlug
        )
    }
    if (params.category) {
        const categorySlug = params.category.toLowerCase()
        displayProducts = displayProducts.filter(
            (p: any) => p.category?.name.toLowerCase().replace(/\s+/g, '-') === categorySlug
        )
    }
    if (params.search) {
        const searchLower = params.search.toLowerCase()
        displayProducts = displayProducts.filter((p: any) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower)
        )
    }

    // Map to Props
    const formattedProducts: ProductType[] = displayProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.id,
        description: p.description,
        featured: false,
        imageUrl: p.images[0]?.url || null,
        images: p.images,
        brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
        category: p.category ? { id: p.category.id, name: p.category.name } : null,
    }))

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <h1 className="text-4xl lg:text-5xl font-heading font-bold uppercase tracking-wide mb-2">
                        Product Catalog
                    </h1>
                    <p className="text-secondary/80 font-sans max-w-2xl text-lg">
                        Browse our comprehensive range of high-quality industrial machine components.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-12">
                        {/* Search */}
                        <div className="bg-secondary/30 p-6 border border-border">
                            <h3 className="font-heading font-bold text-lg text-primary mb-4 uppercase tracking-wider">Search</h3>
                            <form action="/products" method="get">
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={params.search}
                                    placeholder="Search part number..."
                                    className="w-full h-11 px-4 text-sm border-2 border-border focus:border-accent outline-none bg-white font-sans"
                                />
                            </form>
                        </div>

                        {/* Brands Filter */}
                        <div className="bg-secondary/30 p-6 border border-border">
                            <h3 className="font-heading font-bold text-lg text-primary mb-4 uppercase tracking-wider">Brands</h3>
                            <ul className="space-y-3 font-sans">
                                <li>
                                    <Link
                                        href="/products"
                                        className={`block hover:text-accent transition-colors ${!params.brand ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                                    >
                                        All Brands
                                    </Link>
                                </li>
                                {brands.map(b => {
                                    const slug = b.name.toLowerCase().replace(/\s+/g, '-')
                                    const isActive = params.brand === slug
                                    return (
                                        <li key={b.id}>
                                            <Link
                                                href={`/products?brand=${slug}`}
                                                className={`flex items-center justify-between group hover:text-accent transition-colors ${isActive ? 'font-bold text-accent' : 'text-muted-foreground'}`}
                                            >
                                                <span>{b.name}</span>
                                                {isActive && <span className="w-1.5 h-1.5 bg-accent rounded-full" />}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* Categories Filter */}
                        <div className="bg-secondary/30 p-6 border border-border">
                            <h3 className="font-heading font-bold text-lg text-primary mb-4 uppercase tracking-wider">Categories</h3>
                            <ul className="space-y-3 font-sans">
                                <li>
                                    <Link
                                        href="/products"
                                        className={`block hover:text-accent transition-colors ${!params.category ? 'font-bold text-primary' : 'text-muted-foreground'}`}
                                    >
                                        All Categories
                                    </Link>
                                </li>
                                {categories.map(c => {
                                    const slug = c.name.toLowerCase().replace(/\s+/g, '-')
                                    const isActive = params.category === slug
                                    return (
                                        <li key={c.id}>
                                            <Link
                                                href={`/products?category=${slug}`}
                                                className={`flex items-center justify-between group hover:text-accent transition-colors ${isActive ? 'font-bold text-accent' : 'text-muted-foreground'}`}
                                            >
                                                <span>{c.name}</span>
                                                {isActive && <span className="w-1.5 h-1.5 bg-accent rounded-full" />}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {/* Results Count */}
                        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                            <span className="font-heading font-bold text-primary text-xl">
                                {formattedProducts.length} <span className="text-muted-foreground text-base font-normal">Results found</span>
                            </span>
                            {(params.brand || params.category || params.search) && (
                                <Link href="/products" className="text-sm font-bold text-accent hover:underline uppercase tracking-wider">
                                    Clear Filters
                                </Link>
                            )}
                        </div>

                        {formattedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {formattedProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        {...product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-secondary/20 border border-dashed border-border">
                                <p className="text-xl font-heading text-muted-foreground mb-2">No products match your criteria</p>
                                <Link href="/products" className="text-accent hover:underline font-bold">Clear all filters</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
