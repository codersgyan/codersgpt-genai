import * as z from "zod";
import { getJson } from "serpapi";
import { tool } from "@langchain/core/tools";

type ProductFromAPI = {
  product_id: string;
  title: string;
  extracted_price: string;
  description: string;
  rating: number;
  thumbnail: string;
  product_link: string;
};

type Product = {
  id: string;
  title: string;
  price: string;
  description: string;
  rating: number;
  thumbnail: string;
  product_link: string;
};

export const productTool = tool(
  async ({ query, location = "India" }) => {
    try {
      console.log("query:", query);
      console.log("Location:", location);

      // search products on the internet.
      const response = await getJson({
        engine: "google_shopping",
        q: query,
        location: location,
        api_key: process.env.SERP_API_KEY,
      });

      if (
        !response.shopping_results ||
        response.shopping_results.length === 0
      ) {
        return {
          query,
          products: [],
        };
      }

      const products = response.shopping_results
        .slice(0, 6)
        .map(
          (
            product: ProductFromAPI,
            index: number,
          ): Product => {
            return {
              id: product.product_id || String(index),
              title: product.title,
              description: product.description,
              price: product.extracted_price,
              rating: product.rating,
              thumbnail: product.thumbnail,
              product_link:
                product.product_link +
                "&utm_source=codersgpt.com",
            };
          },
        );

      return {
        query,
        products,
      };
    } catch (err) {
      console.error(
        "Error fetching the google shopping products",
        err,
      );
      return {
        query,
        products: [],
      };
    }
  },
  {
    name: "display_products",
    description:
      "Search for real e-commerce products and display a carousel of prices and details. Always call this tool whenever user searches for any kind of product.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "The product to search for. e.g., iPhone 17, Macbook Pro",
        ),
      location: z
        .string()
        .optional()
        .describe(
          "The location of the user for query search. Include this field only if user asks it explicitely e.g., `India`",
        ),
    }),
  },
);

export const tools = [productTool];

// {"type":"tool-input-start","toolCallId":"019ce6cc-61ad-7149-807b-c0816c52033c","toolName":"display_products","dynamic":true}

// {"type":"tool-output-available","toolCallId":"019ce6cc-61ad-7149-807b-c0816c52033c","output":{"lc":1,"type":"constructor","id":["langchain_core","messages","ToolMessage"],"kwargs":{"status":"success","content":"{\"query\":\"iPhone 17 available options\",\"products\":[{\"id\":\"9923803755510183646\",\"title\":\"Apple iPhone 17\",\"price\":829,\"rating\":4.7,\"thumbnail\":\"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRlCWMVGU_Zv8zwk3X0qrQ2DcR6cl9H3Nu6Q5Zy9zfqx4Xf4ls8-fAMkrOrpJR7SRVnEemfgyyeesFOFSP88EVKcl1hT7ACTjlanbu5vxZobm9UOPMYz9Gtggo\",\"product_link\":\"https://www.google.com/search?ibp=oshop&q=iPhone 17 available options&prds=catalogid:9923803755510183646,headlineOfferDocid:3541742718168782257,imageDocid:8458497598884566567,rds:PC_14739022971413544759|PROD_PC_14739022971413544759,gpcid:14739022971413544759,mid:576462866558881327,pvt:hg&hl=en&gl=us&udm=28&utm_sourc=codersgpt.com\"},{\"id\":\"15896364257552515369\",\"title\":\"Apple iPhone 17e\",\"price\":599,\"thumbnail\":\"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSVjeDE5b2u1-30ilsFCMFoNEcJPaKhOfutQ5CjvPXj3u6uEz-sUxTqa9KasT6LC_bosOAjmV9lD6lL9kc4pOLhcq7aSZyUHFcXE5NFi4XDu9s2QYk4P4nA\",\"product_link\":\"https://www.google.com/search?ibp=oshop&q=iPhone 17 available options&prds=catalogid:15896364257552515369,headlineOfferDocid:6722504242528391603,imageDocid:13222224348649101292,gpcid:15096775703250617709,mid:576462883654484663,pvt:hg&hl=en&gl=us&udm=28&utm_sourc=codersgpt.com\"},{\"id\":\"1734000670482862898\",\"title\":\"Apple - iPhone 17 Pro Max 1TB - Deep Blue (Verizon)\",\"price\":44.44,\"rating\":4.3,\"thumbnail\":\"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSWtoLvSfLi8L-CW86sIJo0QLBAeQmGxQyHXAqIWru3UtyjqsZnGGhqj-oJ0KHYK1rVstGr7RBBrUnL7iGrhAOGGC2rlrui\",\"product_link\":\"https://www.google.com/search?ibp=oshop&q=iPhone 17 available options&prds=productid:1734000670482862898,headlineOfferDocid:1734000670482862898,imageDocid:6583468860866954469,rds:PC_5141485329231317038|PROD_PC_5141485329231317038,pvt:hg&hl=en&gl=us&udm=28&utm_sourc=codersgpt.com\"},{\"id\":\"5418757059095985498\",\"title\":\"Apple iPhone 17 Pro Max\",\"price\":1999,\"rating\":4.3,\"thumbnail\":\"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRIkKKA0VjLHCuOcE_l2ZztW0xuUaVgd3dOj-HcYA4XBUH5M4Ludxo3O8beYOjPYA-EXTKE9ul8h0TKTpOpscu_dc-YrXuQwPN470bAj_WDk4HM7UKSCJ3VGw\",\"product_link\":\"https://www.google.com/search?ibp=oshop&q=iPhone 17 available options&prds=catalogid:5418757059095985498,headlineOfferDocid:11348486560003105786,imageDocid:11150482027714153070,rds:PC_5141485329231317038|PROD_PC_5141485329231317038,gpcid:5141485329231317038,mid:576462869544971580,pvt:hg&hl=en&gl=us&udm=28&utm_sourc=codersgpt.com\"},{\"id\":\"14412930680807247509\",\"title\":\"iPhone 17\",\"price\":675,\"rating\":4.7,\"thumbnail\":\"https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQkarpHJgrT913hAhKH9qr8wKLPpAPNm1NkxGnjBKpG0e2CY0bqSEDAjfC5YU26qcpa35zytrgZFmiFHa2qG3BL5Xp3iAdv904Be5XCjPOJRnruRAdh05h-\",\"product_link\":\"https://www.google.com/search?ibp=oshop&q=iPhone 17 available options&prds=productid:14412930680807247509,headlineOfferDocid:14412930680807247509,imageDocid:3102788867550317231,rds:PC_14739022971413544759|PROD_PC_14739022971413544759,pvt:hg&hl=en&gl=us&udm=28&utm_sourc=codersgpt.com\"},{\"id\":\"4121226240847201255\",\"title\":\"iPhone 17e 512GB Black Unlocked- Apple\",\"price\":799,\"thumbnail\":\"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRyZz8DVoPfJclcDd1mVPXhLgzzYBpJBE7wZ0NnHUebxwolLYB_UeI1iUe9tgjLTuOWLoieOSXx0Oz0BRLgnfsfeu94Ae19EJTvrSlCG-qpjFbcwqYxcKAeTA\",\"product_link\":\"https://www.google.com/search?ibp=oshop&q=iPhone 17 available options&prds=productid:4121226240847201255,headlineOfferDocid:4121226240847201255,imageDocid:17326152075987041922,pvt:hg&hl=en&gl=us&udm=28&utm_sourc=codersgpt.com\"}]}","tool_call_id":"call_XW2NT4hchbzPiAcmFrURfKYv","name":"display_products","metadata":{"versions":{"@langchain/core":"1.1.29"}},"additional_kwargs":{},"response_metadata":{}}}}
