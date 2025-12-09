import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import BrandCard from '@/components/BrandCard'

async function getBrands() {
    try {
        const brands = await prisma.brand.findMany({
            include: { _count: { select: { products: true } } }
        })
        return brands
    } catch {
        return [] as { id: string; name: string; _count: { products: number } }[]
    }
}

export default async function BrandsPage() {
    const brands = await getBrands()

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-primary text-primary-foreground py-20">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <h1 className="text-5xl font-heading font-bold uppercase tracking-wide mb-4">
                        Our Brands
                    </h1>
                    <p className="text-secondary/80 text-xl font-sans max-w-2xl mx-auto">
                        We are authorized dealers for premium industrial manufacturers.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {brands.map(brand => (
                        <BrandCard
                            key={brand.id}
                            name={brand.name}
                            count={brand._count.products}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
