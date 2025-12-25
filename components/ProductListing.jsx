import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import ProductCard from "../components/ProductCard";
import BottomSheetFilter from "../components/BottomSheetFilter";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(null);

  // Fetch products when component mounts or filters change
  useEffect(() => {
    fetchProducts();
  }, [activeFilters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Start with a base query
      let productsQuery = collection(db, "products");

      // If there are active filters, apply them to the query
      if (activeFilters) {
        productsQuery = buildFilteredQuery(productsQuery);
      } else {
        // Default query with no filters
        productsQuery = query(productsQuery, limit(20));
      }

      const querySnapshot = await getDocs(productsQuery);
      const productsList = [];

      querySnapshot.forEach((doc) => {
        productsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const buildFilteredQuery = (baseQuery) => {
    let filteredQuery = baseQuery;

    // Apply category filters
    if (
      activeFilters.category &&
      Object.keys(activeFilters.category).length > 0
    ) {
      Object.keys(activeFilters.category).forEach((categoryName) => {
        const categoryItems = activeFilters.category[categoryName];
        if (categoryItems.length > 0) {
          filteredQuery = query(
            filteredQuery,
            where("categories", "array-contains-any", categoryItems)
          );
        }
      });
    }

    // Apply brand filter
    if (activeFilters.brand && activeFilters.brand.length > 0) {
      filteredQuery = query(
        filteredQuery,
        where("brand", "in", activeFilters.brand)
      );
    }

    // Apply rating filter - assuming rating is a number
    if (activeFilters.rating && activeFilters.rating.length > 0) {
      // Find the minimum rating from selected ratings
      const minRating = Math.min(...activeFilters.rating);
      filteredQuery = query(filteredQuery, where("rating", ">=", minRating));
    }

    // Apply gender filter
    if (activeFilters.gender) {
      filteredQuery = query(
        filteredQuery,
        where("gender", "==", activeFilters.gender.value)
      );
    }

    // Apply size filter
    if (activeFilters.size) {
      filteredQuery = query(
        filteredQuery,
        where("sizes", "array-contains", activeFilters.size.value)
      );
    }

    // Apply price range filter
    if (activeFilters.priceRange && activeFilters.priceRange[1]) {
      filteredQuery = query(
        filteredQuery,
        where("price", "<=", activeFilters.priceRange[1])
      );
    }

    // Apply sorting
    if (activeFilters.sort) {
      switch (activeFilters.sort.value) {
        case "price-low-to-high":
          filteredQuery = query(filteredQuery, orderBy("price", "asc"));
          break;
        case "price-high-to-low":
          filteredQuery = query(filteredQuery, orderBy("price", "desc"));
          break;
        case "newest":
          filteredQuery = query(filteredQuery, orderBy("createdAt", "desc"));
          break;
        case "best-selling":
          filteredQuery = query(filteredQuery, orderBy("soldCount", "desc"));
          break;
        case "best-rated":
          filteredQuery = query(filteredQuery, orderBy("rating", "desc"));
          break;
        default:
          break;
      }
    }

    // Add a default limit
    filteredQuery = query(filteredQuery, limit(50));

    return filteredQuery;
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  return (
    <View style={{ flex: 1 }}>
      <BottomSheetFilter onApplyFilters={handleApplyFilters} />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : products.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
    </View>
  );
};

export default ProductListing;
