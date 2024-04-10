"use client";

import CATEFORIES_QUERY from "@/graphql/queries/getCategories";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import Image from "next/image";
import React from "react";

// IT IS ONLY FOR DEMO PURPOSES: modify this component to fit the project needs

const CategoryList = ({ className }: { className?: string }) => {
  const { loading, error, data, fetchMore } = useQuery(CATEFORIES_QUERY, {
    variables: { first: 5 },
  });

  return (
    <div className={className}>
      <h2>Categories</h2>
      {data && data.categories && (
        <table className="table-fixed w-full border-2 border-black">
          <thead className="border-b-2 border-black">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {data.categories.edges.map(({ node: category }) => {
              const metadata = JSON.parse(category.description ?? "{}");
              return (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{metadata?.description}</td>
                  <td className="relative h-24 w-24">
                    {metadata?.image && (
                      <Image
                        src={metadata.image}
                        alt={category.name ?? ""}
                        fill
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && data.categories && data.categories.pageInfo.hasNextPage && (
        <button
          type="button"
          disabled={loading}
          className="button border-2 border-black px-8 py-2 hover:bg-black hover:text-white"
          onClick={() =>
            fetchMore({
              variables: {
                after: data.categories!.pageInfo.endCursor,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (
                  !fetchMoreResult ||
                  !prev.categories ||
                  !fetchMoreResult.categories
                ) {
                  return prev;
                }
                return {
                  ...fetchMoreResult,
                  categories: {
                    ...fetchMoreResult.categories,
                    edges: [
                      ...prev.categories.edges,
                      ...fetchMoreResult.categories.edges,
                    ],
                  },
                };
              },
            })
          }
        >
          Fetch more
        </button>
      )}
    </div>
  );
};

export default CategoryList;
