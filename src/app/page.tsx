'use client';
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BE_URL = "https://api.bestbuyelectronics.lk";

// images
import categoryOne from "@/../public/images/tv.png"
import categoryTwo from "@/../public/images/smartPhone.png"
import categoryThree from "@/../public/images/soundSystems.jpg"
import categoryFour from "@/../public/images/Refrigerators.jpg"
import categoryFive from "@/../public/images/washingMashing.jpg"

import postOne from "@/../public/images/posts/postOne.png"
import postTwo from "@/../public/images/posts/postTwo.png"
import postThree from "@/../public/images/posts/postThree.png"

import CategoryCard from "@/components/ItemCategory";
import HeroSection from "@/components/HeroSection";
import ItemCard from "@/components/ItemCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiClient } from "@/libs/network";

interface Category {
    id: string | number;
    name: string;
    image: string;
    parent?: string | number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    model_number?: string;
    price: number;
    old_price?: number;
    quantity: number;
    warranty?: number;
    delivery_available: boolean;
    category: string;
    subcategory?: string;
    image_url?: string;
    description?: string;
    images?: string[];
}

interface ProductListResponse {
    count: number;
    total_pages: number;
    current_page: number;
    limit: number;
    results: Product[];
}

type CategoryKey = 'category1' | 'category2' | 'category3' | 'category4' | 'category5' | 'category6';

const loadProducts = (params: { category?: number; subcategory?: number }) => {
    const query = new URLSearchParams();

    if (params.category) query.append('category', params.category.toString());
    if (params.subcategory) query.append('subcategory', params.subcategory.toString());

    return apiClient.get<ProductListResponse>(`products/?${query.toString()}`);
};

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);

    const [productsByCategory, setProductsByCategory] = useState<Record<CategoryKey, Product[]>>({
        category1: [],
        category2: [],
        category3: [],
        category4: [],
        category5: [],
        category6: [],
    });

    const loadProductsByCategory = async (categoryKey: CategoryKey, category: number) => {
        try {
            const res = await loadProducts({ category });
            setProductsByCategory(prev => ({
                ...prev,
                [categoryKey]: res.results,
            }));
        } catch (error) {
            console.error(`Failed to load products for ${categoryKey}:`, error);
        }
    };

    useEffect(() => {
        loadProducts({}).then(res => {
            setNewProducts(res.results);
        });

        apiClient.get<Category[]>('categories/').then(async res => {
            const rootCategories = res.filter(
                category => category.parent === null || category.parent === undefined || category.parent === ''
            );

            setCategories(rootCategories);

            for (let i = 0; i < rootCategories.length && i < 6; i++) {
                const categoryKey = `category${i + 1}` as CategoryKey;
                const categoryId = Number(rootCategories[i].id);
                await loadProductsByCategory(categoryKey, categoryId);
            }
        });
    }, []);

    return (
        <div>
            <HeroSection />
            <div className="mx-4 sm:mx-6 md:mx-12">

                <section className='flex justify-center overflow-x-auto no-scrollbar space-x-6'>
                    <CategoryCard imageSrc={categoryOne} title="Tv & Home" />
                    <CategoryCard imageSrc={categoryTwo} title="Smart Phones" />
                    <CategoryCard imageSrc={categoryThree} title="soundSy Systems" />
                    <CategoryCard imageSrc={categoryFour} title="Frigerators" />
                    <CategoryCard imageSrc={categoryFour} title="Frigerators" />
                    <CategoryCard imageSrc={categoryFive} title="Washing Machines" />
                </section>

                <div>
                    <div className="border-b border-gray-300 pb-1 mb-2 mt-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-gray-800 text-xs md:text-sm font-medium">New Arrived</h1>
                            <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW ALL</a>
                        </div>
                    </div>
                </div>
                <div className="flex overflow-x-auto gap-6 no-scrollbar">
                    {newProducts.map(product => (
                        <div key={product.id} className="flex-shrink-0">
                            <ItemCard
                                id={product.id}
                                imageUrl={`${BE_URL}${product.images?.[0] || ''}`}
                                imageSrc={categoryOne}
                                title={product.name}
                                oldPrice={product.old_price}
                                newPrice={product.price}
                                inStock={product.quantity > 0}
                            />
                        </div>
                    ))}
                    {newProducts.length === 0 && (
                        <p className="text-xs text-gray-500 w-full">No products available.</p>
                    )}
                </div>

                <section className='flex justify-center flex-wrap'>

                    <div className='flex gap-5 my-14 justify-center w-full'>
                        <div>
                            <Image src={postOne} alt="" className='rounded-md' />
                        </div>
                        <div>
                            <Image src={postTwo} alt="" className='rounded-md' />
                        </div>
                    </div>

                    {categories.slice(0, 6).map((category, index) => {
                        const categoryKey = `category${index + 1}` as CategoryKey;
                        const products = productsByCategory[categoryKey] || [];

                        return (
                            <div key={category.id} className="mt-10 w-full">
                                <div className="border-b border-gray-300 pb-1 mb-2">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-gray-800 text-xs md:text-sm font-medium">{category.name}</h1>
                                        <a href="#" className="text-blue-600 hover:text-blue-800 text-xs md:text-sm">VIEW ALL</a>
                                    </div>
                                </div>

                                <div className="flex overflow-x-auto gap-4 no-scrollbar">
                                    {products.map(product => (
                                        <div key={product.id} className="flex-shrink-0">
                                            <ItemCard
                                                id={product.id}
                                                imageUrl={`${BE_URL}${product.images?.[0] || ''}`}
                                                imageSrc={categoryOne}
                                                title={product.name}
                                                oldPrice={product.old_price}
                                                newPrice={product.price}
                                                inStock={product.quantity > 0}
                                            />
                                        </div>
                                    ))}
                                    {products.length === 0 && (
                                        <p className="text-xs text-gray-500 w-full">No products available.</p>
                                    )}
                                </div>


                            </div>
                        );
                    })}

                    <div className="mt-10 w-full">
                        <Image src={postThree} alt="" className='rounded-md' />
                    </div>
                </section>
            </div>
        </div>
    );
}
