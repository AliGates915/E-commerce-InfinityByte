import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { PuffLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import { fetchPromotionSections } from "../services/promotionApi";

const Features = () => {
  const { data: sections = [], isLoading, isError } = useQuery({
    queryKey: ["promotionSections"],
    queryFn: fetchPromotionSections,
    staleTime: 1000 * 60 * 5, // cache 5 minutes
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <PuffLoader />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load products</p>;
  }

  return (
    <>
      {sections.map((section) => (
        <section key={section._id} className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-newPrimary mb-4">
                {section.name} Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to={`/product-categories/${section.name.toLowerCase()}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                View All {section.name} Products
                <FaArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default Features;