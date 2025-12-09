import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import CategoryCard from '@/components/CategoryCard'

interface Category {
    id: string
    name: string
    _count: { products: number }
}

async function getCategories(): Promise<Category[]> {
    try {
        // Fetch all categories with product count
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } }
        })
        return categories
    } catch {
        return []
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-5xl font-heading font-bold uppercase tracking-wide mb-4">
                        Product Categories
                    </h1>
                    <p className="text-secondary/80 text-xl font-sans max-w-2xl mx-auto">
                        Explore our extensive range of industrial components by category.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(cat => (
                        <CategoryCard
                            key={cat.id}
                            name={cat.name}
                            count={cat._count.products}
                            slug={cat.name.toLowerCase().replace(/\s+/g, '-')}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
