/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        
        brand: {
          DEFAULT: "#FF3131",
          primary: "#FFFFFF",
          secondary: "#F6F8FB",
          midnight: "#1A1C29",
          urbanGray: "#797979",
          coralRed: "#F14A58",
          overlay: "#CBD4E1",
          silverChalice: "#B6B0AC",

        },

        positive: {
          DEFAULT: "#016A1C",
          200: "#17BF33",
          100: "#E1FCDE",
        },
        negative: {
          DEFAULT: "#B1000F",
          200: "#F14A58",
          100: "#FFD4D8",
        },
        informative: {
          DEFAULT: "105FCE",
          200: "#5598F6",
          100: "#E0EDFF",
        },
        interactive: {
          DEFAULT: "#5C17E5",
          200: "#B3BEFF",
          100: "#EDE6FF",
        },
        warning: {
          DEFAULT: "#F2930D",
          100: "#FFF2D2",
        },
        disabled: {
          DEFAULT: "#B6B0AC",
          200: "#D3D0CD",
          100: "#F5F4F3",
        },
        pink: {
          DEFAULT: "#FF66C4",
          100: "#EFE8DE",
        },
      },
      fontFamily: {
        kthin: ["KumbhSans-Thin", "sans-serif"],
        kextralight: ["KumbhSans-ExtraLight", "sans-serif"],
        klight: ["KumbhSans-Light", "sans-serif"],
        kregular: ["KumbhSans-Regular", "sans-serif"],
        kmedium: ["KumbhSans-Medium", "sans-serif"],
        ksemibold: ["KumbhSans-SemiBold", "sans-serif"],
        kbold: ["KumbhSans-Bold", "sans-serif"],
        kextrabold: ["KumbhSans-ExtraBold", "sans-serif"],
        kblack: ["KumbhSans-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}

