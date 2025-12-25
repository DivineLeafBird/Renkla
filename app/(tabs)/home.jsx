import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { images } from "../../constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import heroScroll from "../../data/heroScroll";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import {
  categories,
  genderFilters,
  promoFilters,
  sizeFilters,
} from "../../data/categoryList";
import brandList from "../../data/brandList";
import CustomButton from "../../components/CustomButton";
import Picker from "../../components/Picker";
import DialogModal from "../../components/DialogModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "../../components/ProductCard";

const FILTERS_STORAGE_KEY = "saved_filters";
const SELECTED_CATEGORY_KEY = "selected_category";

const Home = ({ onApplyFilters }) => {
  // Scroll Filter
  const [selectedScrollFilter, setSelectedScrollFilter] = useState("");

  const handleScrollFilterChange = (filter) => {
    setSelectedScrollFilter(filter);
  };

  // Bottom Sheet
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["30%", "70%", "90%"], []);

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const bottomSheetHandle = () => {
    bottomSheetRef.current?.expand();
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setBottomSheetVisible(false);
  };

  // Selected category state
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);

  // Initial filter state to compare changes against
  const initialFilters = {
    brand: new Set(),
    rating: new Set(),
    category: {},
    sort: "",
    size: "",
    gender: "",
    priceRange: [0, null],
  };

  // State to manage filters
  const [filters, setFilters] = useState({ ...initialFilters });

  // Track if filters have been modified
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Modal states
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [applyModalVisible, setApplyModalVisible] = useState(false);

  // Count active filters
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Load saved filters on component mount
  useEffect(() => {
    loadSavedFilters();
  }, []);

  // Save filters to AsyncStorage
  const saveFilters = async (filtersToSave, category) => {
    try {
      // Convert Sets to arrays for JSON serialization
      const serializedFilters = {
        brand: Array.from(filtersToSave.brand),
        rating: Array.from(filtersToSave.rating),
        category: {},
        sort: filtersToSave.sort,
        size: filtersToSave.size,
        gender: filtersToSave.gender,
        priceRange: filtersToSave.priceRange,
      };

      // Convert all category Sets to arrays
      Object.keys(filtersToSave.category).forEach((cat) => {
        serializedFilters.category[cat] = Array.from(
          filtersToSave.category[cat] || []
        );
      });

      await AsyncStorage.setItem(
        FILTERS_STORAGE_KEY,
        JSON.stringify(serializedFilters)
      );
      await AsyncStorage.setItem(SELECTED_CATEGORY_KEY, category);
    } catch (error) {
      console.error("Error saving filters:", error);
    }
  };

  // Load filters from AsyncStorage
  const loadSavedFilters = async () => {
    try {
      const savedFiltersJSON = await AsyncStorage.getItem(FILTERS_STORAGE_KEY);
      const savedCategory = await AsyncStorage.getItem(SELECTED_CATEGORY_KEY);

      if (savedFiltersJSON && savedCategory) {
        const savedFilters = JSON.parse(savedFiltersJSON);

        // Convert arrays back to Sets
        const deserializedFilters = {
          brand: new Set(savedFilters.brand),
          rating: new Set(savedFilters.rating),
          category: {},
          sort: savedFilters.sort,
          size: savedFilters.size,
          gender: savedFilters.gender,
          priceRange: savedFilters.priceRange,
        };

        // Convert all category arrays back to Sets
        Object.keys(savedFilters.category).forEach((cat) => {
          deserializedFilters.category[cat] = new Set(
            savedFilters.category[cat]
          );
        });

        setFilters(deserializedFilters);
        setSelectedCategory(savedCategory);
      }
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  };

  // Update filters changed status
  useEffect(() => {
    const countActiveFilters = () => {
      let count = 0;

      // Count brand filters
      count += filters.brand.size;

      // Count rating filters
      count += filters.rating.size;

      // Count category filters
      Object.keys(filters.category).forEach((cat) => {
        if (filters.category[cat]?.size > 0) {
          count += filters.category[cat].size;
        }
      });

      // Count single-select filters
      if (filters.sort) count++;
      if (filters.size) count++;
      if (filters.gender) count++;
      if (filters.priceRange[1]) count++;

      return count;
    };

    const filterCount = countActiveFilters();
    setActiveFilterCount(filterCount);

    // Compare with initial state to determine if filters have changed
    const hasChanged = filterCount > 0;
    setFiltersChanged(hasChanged);
  }, [filters]);

  const updateFilters = (filter, categoryName, item) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filter === "category") {
        // If categoryName is provided but item is null, set the selected category
        if (categoryName && item === null) {
          setSelectedCategory(categoryName);
          return updatedFilters;
        }

        // Ensure the category object exists
        if (!updatedFilters.category[categoryName]) {
          updatedFilters.category[categoryName] = new Set();
        }

        const categorySet = updatedFilters.category[categoryName];
        if (categorySet.has(item)) {
          categorySet.delete(item);
        } else {
          categorySet.add(item);
        }
      } else if (["brand", "rating"].includes(filter)) {
        if (!updatedFilters[filter]) {
          updatedFilters[filter] = new Set();
        }

        const filterSet = updatedFilters[filter];
        if (filterSet.has(item)) {
          filterSet.delete(item);
        } else {
          filterSet.add(item);
        }
      } else if (["sort", "size", "gender"].includes(filter)) {
        updatedFilters[filter] = item;
      } else if (filter === "priceRange") {
        updatedFilters.priceRange = [0, item];
      }

      return updatedFilters;
    });
  };

  // Reset all filters to initial state
  const resetFilters = async () => {
    const newFilters = {
      brand: new Set(),
      rating: new Set(),
      category: {},
      sort: "",
      size: "",
      gender: "",
      priceRange: [0, null],
    };

    setFilters(newFilters);
    setSelectedCategory(categories[0].name);
    setResetModalVisible(false);

    // Clear filters from AsyncStorage
    try {
      await AsyncStorage.removeItem(FILTERS_STORAGE_KEY);
      await AsyncStorage.removeItem(SELECTED_CATEGORY_KEY);
    } catch (error) {
      console.error("Error clearing saved filters:", error);
    }
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    // Convert filter sets to arrays for easier consumption by parent component
    const formattedFilters = {
      brand: Array.from(filters.brand),
      rating: Array.from(filters.rating),
      category: {},
      sort: filters.sort,
      size: filters.size,
      gender: filters.gender,
      priceRange: filters.priceRange,
    };

    // Convert category Sets to arrays
    Object.keys(filters.category).forEach((cat) => {
      formattedFilters.category[cat] = Array.from(filters.category[cat] || []);
    });

    // Pass filters to parent component
    if (onApplyFilters) {
      onApplyFilters(formattedFilters);
    }

    // Save filters to AsyncStorage
    saveFilters(filters, selectedCategory);

    setApplyModalVisible(false);
    closeBottomSheet();
  };

  // Get filtered items based on selected category
  const filteredItems = selectedCategory
    ? categories.find((category) => category.name === selectedCategory)
        ?.items ?? []
    : [];

  // Ensure all items have a 'name' property before sorting
  const validItems = filteredItems.filter((item) => item?.name);

  // Sort items alphabetically
  const sortedItems = validItems.sort((a, b) => a.name.localeCompare(b.name));

  const [openDropdown, setOpenDropdown] = useState(null);
  const [showFilter, setShowFilter] = useState(null);

  const toggleDropdown = (filter) => {
    if (openDropdown === filter) {
      setOpenDropdown(null);
      setShowFilter(null);
    } else {
      setOpenDropdown(filter);
      setShowFilter(filter);
    }
  };

  // Function to check if a category has been selected
  const isCategorySelected = (categoryName) => {
    return selectedCategory === categoryName;
  };

  // Function to check if an item in a category has been selected
  const isItemSelected = (itemName) => {
    if (!selectedCategory || !filters.category[selectedCategory]) {
      return false;
    }
    return filters.category[selectedCategory].has(itemName);
  };

  // Get active filter summary for apply confirmation
  const getFilterSummary = () => {
    const summary = [];

    if (filters.brand.size > 0) {
      summary.push(`Brands: ${Array.from(filters.brand).join(", ")}`);
    }

    if (filters.rating.size > 0) {
      summary.push(
        `Ratings: ${Array.from(filters.rating).join(", ")} star${
          filters.rating.size > 1 ? "s" : ""
        }`
      );
    }

    Object.keys(filters.category).forEach((cat) => {
      if (filters.category[cat]?.size > 0) {
        summary.push(`${cat}: ${Array.from(filters.category[cat]).join(", ")}`);
      }
    });

    if (filters.sort) {
      summary.push(`Sort by: ${filters.sort.name}`);
    }

    if (filters.size) {
      summary.push(`Size: ${filters.size.name}`);
    }

    if (filters.gender) {
      summary.push(`Gender: ${filters.gender.name}`);
    }

    if (filters.priceRange[1]) {
      summary.push(`Price Range: 0 - ${filters.priceRange[1]} Ksh`);
    }

    return summary;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 w-screen bg-brand-secondary items-center">
          {/* Hero Section */}
          <View className="h-[422px] w-full">
            <ImageBackground
              source={images.hero}
              style={{ width: "105%", marginLeft: "-10%" }}
              className="h-full"
              resizeMode="cover"
            >
              <LinearGradient
                colors={["rgba(1, 1, 1, 0.00)", "rgba(0, 0, 0, 0.99)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                  flex: 1,
                  width: "110%",
                  marginLeft: "0%",
                }}
              >
                <View className="flex-1 items-center justify-center mx-4 inset-y-1/4 ">
                  <Text className="text-2xl sm:text-3xl font-kbold text-center text-white">
                    Discover Your Unique Style
                  </Text>
                  <Text className="text-lg sm:text-2xl font-kmedium px-4 py-2 text-center text-white">
                    Exquisite Fashion, Personalized for You
                  </Text>
                  <Text className="text-base sm:text-lg font-klight px-4 sm:px-16 text-center text-white">
                    Explore our exclusive collection of garments, fragrances,
                    footwear, jewellery, and skincare products. Tailored to fit
                    your unique taste and style.
                  </Text>
                  <TouchableOpacity
                    className="w-1/4 mb-6 items-center justify-center py-3 sm:py-6"
                    onPress={() => router.push("/categories")}
                  >
                    <View className="w-28 h-8 bg-brand-primary items-center justify-center rounded-2xl ">
                      <Text className="text-brand-midnight font-kmedium text-sm text-center">
                        Shop now
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Scroll Filter */}

          <View className="w-screen flex-col items-center justify-between my-2">
            <Text
              className="text-2xl font-kmedium text-center text-brand-midnight"
              onPress={() => handleScrollFilterChange("")}
            >
              Explore our wide range of fashion and lifestyle products.
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row gap-4 px-4 mt-4"
              bounces={false}
            >
              {heroScroll.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    index === heroScroll.length - 1 && { marginRight: 24 },
                  ]}
                  className="flex-col items-center justify-center space-y-2"
                >
                  <Pressable
                    className={` w-36 h-24 ${
                      selectedScrollFilter === item.title
                        ? "border-2 border-interactive"
                        : ""
                    }  shadow-md rounded-2xl overflow-hidden `}
                    onPress={() => handleScrollFilterChange(item.title || "")}
                  >
                    <Image source={item.image} className="w-full h-full" />
                  </Pressable>
                  <Text
                    className={`text-base font-kmedium text-center ${
                      selectedScrollFilter === item.title
                        ? "text-interactive"
                        : "text-brand-midnight"
                    }`}
                  >
                    {item.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
          {/* Featured Products */}
          <View className="w-screen flex-row items-center justify-between my-8 px-4">
            <Text className="text-2xl font-kmedium text-brand-midnight">
              Discover
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                bottomSheetHandle();
              }}
            >
              <Ionicons name="filter-outline" size={24} color="#000" />
              {activeFilterCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-interactive rounded-full h-5 w-5 items-center justify-center">
                  <Text className="text-xs text-white font-kbold">
                    {activeFilterCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap items-center justify-center border border-red-500 pb-4">
            <ProductCard />
            <ProductCard />
            <ProductCard />
            <ProductCard />

            <CustomButton
              title="Load More"
              handlePress={() => {}}
              containerStyles="w-1/4 my-4"
              textStyles="text-sm font-kmedium sm:text-base "
            />
          </View>
        </View>
      </ScrollView>
      {/*Bottomsheet Filters */}
      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetVisible ? 2 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={closeBottomSheet}
      >
        <View className="flex-1 bg-white rounded-t-3x px-4 ">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-kmedium text-brand-midnight">
              {""}
            </Text>
            <Text className="text-2xl font-kmedium text-brand-midnight ml-12">
              Filter{activeFilterCount > 0 ? "s" : ""}{" "}
              <Text className="text-base font-kmedium text-brand-urbanGray">
                {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (filtersChanged) {
                  setResetModalVisible(true);
                } else {
                  Alert.alert("No filters to reset");
                }
              }}
            >
              <Text className="text-base font-kmedium text-brand-urbanGray">
                Reset
              </Text>
            </TouchableOpacity>
          </View>
          <BottomSheetScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            className="flex-1 overflow-hidden "
          >
            {/* Filter Button */}
            <View className="mt-4">
              <View className="flex-row items-center justify-center gap-4  mt-2">
                {["Sort", "Category", "Size", "Gender"].map((filter) => (
                  <View key={filter} className="items-center justify-center ">
                    <TouchableOpacity
                      onPress={() => toggleDropdown(filter)}
                      className={`flex flex-row items-center justify-center p-[6px] rounded-2xl border border-brand-silverChalice`}
                    >
                      <Text className="text-xs sm:text-sm font-kmedium text-center text-brand-midnight">
                        {filter}{" "}
                      </Text>
                      <Ionicons
                        name={
                          openDropdown === filter
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={16}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Sort */}
            {showFilter === "Sort" ? (
              <Picker
                modalVisible={openDropdown === "Sort"}
                onClose={() => toggleDropdown("")}
                data={promoFilters}
                onSelect={(item) => updateFilters("sort", null, item)}
                title="Sort By"
              />
            ) : null}

            {/* Categories list */}
            {showFilter === "Category" ? (
              <View className="flex-1 flex-row bg-white mt-2">
                {/* Sidebar */}
                <ScrollView className="w-[5%] border-r border-t border-gray-300">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`p-4 ${
                        isCategorySelected(category.name)
                          ? "bg-gray-100 border-l-4 border-interactive "
                          : ""
                      }`}
                      onPress={() =>
                        updateFilters("category", category.name, null)
                      }
                    >
                      <Text
                        className={`text-sm ${
                          isCategorySelected(category.name)
                            ? "font-bold text-brand-midnight"
                            : "text-gray-500"
                        }`}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Main Categories Items Content */}
                <ScrollView className="flex-1">
                  {sortedItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      className={`p-4 border-t border-gray-200 flex-row justify-between items-center ${
                        isItemSelected(item.name) ? "bg-gray-100" : ""
                      }`}
                      onPress={() =>
                        updateFilters("category", selectedCategory, item.name)
                      }
                    >
                      <Text
                        className={`text-sm ${
                          isItemSelected(item.name)
                            ? "font-bold text-brand-midnight"
                            : "text-gray-500"
                        }`}
                      >
                        {item.name}
                      </Text>
                      {isItemSelected(item.name) && (
                        <Ionicons name="checkmark" size={16} color="#000" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Size */}
            {showFilter === "Size" ? (
              <Picker
                modalVisible={openDropdown === "Size"}
                onClose={() => toggleDropdown("")}
                data={sizeFilters}
                onSelect={(item) => updateFilters("size", null, item)}
                title="Select a Size"
              />
            ) : null}

            {/* Gender */}
            {showFilter === "Gender" ? (
              <Picker
                modalVisible={openDropdown === "Gender"}
                onClose={() => toggleDropdown("")}
                data={genderFilters}
                onSelect={(item) => updateFilters("gender", null, item)}
                title="Select Gender"
              />
            ) : null}

            {/* Brands */}
            <View className="mt-4">
              <Text className="text-lg font-ksemibold text-brand-midnight">
                Popular Brands
              </Text>
              <View className="flex flex-wrap flex-row  items-center gap-4 justify-start mt-2">
                {brandList.map((brand) => (
                  <View
                    key={brand.id}
                    className=" flex flex-col items-center justify-center "
                  >
                    <TouchableOpacity
                      className={`w-[70px] sm:w-[150px] aspect-[6/4] sm:aspect-[5/2] mt-4 p-1 items-center justify-center rounded-lg border border-brand-silverChalice ${
                        filters.brand.has(brand.name)
                          ? "bg-informative-200/40 border-transparent"
                          : ""
                      }`}
                      onPress={() => updateFilters("brand", null, brand.name)}
                    >
                      {brand.image ? (
                        <Image
                          source={brand.image}
                          className="w-full h-full"
                          resizeMode="contain"
                        />
                      ) : (
                        <Ionicons name="image" size={24} color="#000" />
                      )}
                    </TouchableOpacity>
                    {brand.image ? (
                      ""
                    ) : (
                      <Text className="text-xs sm:text-sm font-kmedium text-center text-brand-midnight">
                        {brand.name}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
            {/* Ratings */}
            <View className="mt-4">
              <Text className="text-lg font-ksemibold text-brand-midnight">
                Ratings
              </Text>
              <View className="flex-row  items-center gap-4 justify-start mt-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <View key={rating} className="items-center justify-center ">
                    <TouchableOpacity
                      className={`flex flex-row items-center justify-center p-1  w-[52px] sm:w-[116px] aspect-[6/4] sm:aspect-[5/2]  rounded-lg border border-brand-silverChalice ${
                        filters.rating.has(rating)
                          ? "bg-informative-200/40 border-transparent"
                          : ""
                      }`}
                      onPress={() => updateFilters("rating", null, rating)}
                    >
                      <Text className="text-base sm:text-lg font-kbold text-center text-brand-midnight">
                        {rating}{" "}
                      </Text>
                      <Ionicons name="star" size={16} color="#FF3131" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
            {/* Price Range */}
            <View className="flex-1  mt-8">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-ksemibold text-brand-midnight">
                  Price Range
                </Text>
                <Text className="text-lg px-2 font-ksemibold text-informative-200">
                  {filters.priceRange[1] === 50000 ? "Over" : "0"} -{" "}
                  {filters.priceRange[1]} Ksh
                </Text>
              </View>
              <Text className="text-base  mt-4 font-kmedium text-stone-500">
                Select a price range
              </Text>
              <View className="flex-row items-center justify-center flex-wrap gap-4 mt-2">
                {[500, 1000, 5000, 10000, 15000, 20000, 30000, 50000].map(
                  (priceLimit) => (
                    <View
                      key={priceLimit}
                      className="items-center justify-center "
                    >
                      <TouchableOpacity
                        onPress={() =>
                          updateFilters("priceRange", null, priceLimit)
                        }
                        className={`flex flex-row  items-center justify-center p-1  w-[62px] sm:w-[116px] aspect-[6/4] sm:aspect-[5/2]  rounded-lg border border-brand-silverChalice ${
                          filters.priceRange[1] === priceLimit
                            ? "bg-informative-200/40 border-transparent"
                            : ""
                        } `}
                      >
                        <Text className="text-xs sm:text-sm font-kmedium text-center text-brand-midnight">
                          {priceLimit === 50000 ? "Over" : ""} Ksh {priceLimit}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>
            </View>

            <CustomButton
              title={`Apply${
                activeFilterCount > 0 ? ` (${activeFilterCount})` : ""
              }`}
              handlePress={() => {
                if (filtersChanged) {
                  setApplyModalVisible(true);
                } else {
                  Alert.alert("No filters to apply");
                }
              }}
              containerStyles="w-full my-4"
              disabled={!filtersChanged}
              // isLoading={""}
              textStyles="text-sm font-kmedium sm:text-base "
            />
          </BottomSheetScrollView>
        </View>
      </BottomSheet>

      {/* Reset Confirmation Modal */}

      <DialogModal
        modalVisible={resetModalVisible}
        toggleModalVisible={() => setResetModalVisible(false)}
        getSummary={getFilterSummary}
        handleAction={resetFilters}
        title="Reset Filters"
        message={
          <Text>
            Are you sure you want to{" "}
            <Text className="font-kbold text-brand-midnight">
              reset all filters?
            </Text>{" "}
            This will clear{" "}
            <Text className="font-kbold text-brand-midnight">
              {activeFilterCount}{" "}
            </Text>{" "}
            active filter{activeFilterCount !== 1 ? "s" : ""}.
          </Text>
        }
        actionBtnText="Reset All"
        BtnStyles="bg-negative-200"
      />

      {/* Apply Confirmation Modal */}
      <DialogModal
        modalVisible={applyModalVisible}
        toggleModalVisible={() => setApplyModalVisible(false)}
        getSummary={getFilterSummary}
        handleAction={handleApplyFilters}
        title="Apply Filters"
        message={
          <Text>
            You are about to apply{" "}
            <Text className="font-kbold text-brand-midnight">
              {activeFilterCount}
            </Text>{" "}
            filter{activeFilterCount !== 1 ? "s" : ""}
          </Text>
        }
        actionBtnText="Apply"
        BtnStyles="bg-brand-midnight"
      />
    </GestureHandlerRootView>
  );
};

export default Home;
