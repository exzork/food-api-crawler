import axios from "axios";
import * as fs from "fs";
import {RecipeDetail, RecipesRequest, Results} from "./types";

const api_url = "https://masak-apa-tomorisakura.vercel.app/api";

async function getRecipeDetail(key: string): Promise<RecipeDetail> {
    const response = await axios.get<RecipeDetail>(`${api_url}/recipe/${key}`);
    return response.data;
}

async function getRecipes() {
    let error = false;
    let recipes_key: string[] = [];
    let i = 0;
    let max = 100000000000000;
    let arr = Array(1000).fill(0);
    for await (const r of arr) {
        console.log(`Getting recipes page ${i}...`);
        await axios.get<RecipesRequest>(`${api_url}/recipes/${i}`).then(async (response) => {
            const recipes = response.data.results;
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                if (!recipes_key.includes(recipe.key)) {
                    console.log(`Getting recipe ${recipe.key}...`);
                    const recipe_detail = await getRecipeDetail(recipe.key);
                    fs.appendFileSync("data.json", JSON.stringify(recipe_detail.results));
                    recipes_key.push(recipe.key);
                } else {
                    console.log("Recipe already exists");
                }
            }
            i++;
        }).catch((err) => error = true);
    }
}


const words_to_remove = [
    "[^a-zA-Z ]+",
    "sdm", "sdt", "buah", "siung", "lembar daun", "lembar", "kecil",
    " g ", "mg", "cm", " ml", " L ", " kg", "gr", " x", "butir", "ekor", "sedang", "memanjang", "porsi",
    "rendam air", "selama", "jam ", "mendidih", "ukuran", "bungkus", "merebus", "korek", " api", "olesan", "menggoreng",
    "seduh", "cincang", "untuk", "menumis", "bagian", "potong", "iris", "tipis", "haluskan", "dadu", "halus"];
const regex = new RegExp(`(${words_to_remove.join("|")})`, "gi");

async function cleanup() {
    fs.readFile("data.json", (err, data) => {
        if (err) {
            console.log(err);
        }
        const recipes = JSON.parse(data.toString()) as Results[];
        const cleaned_data: Results[] = [];
        console.log("Cleaning up data...");
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            for (const ingredient of recipe.ingredient) {
                let cleaned_ingredient = ingredient.replace(regex, " ");
                cleaned_ingredient = cleaned_ingredient.trim();
                cleaned_ingredient = cleaned_ingredient.replace(/(^| ).( |$)/g, "");
                cleaned_ingredient = cleaned_ingredient.trim();
                let cleaned_ingredient_arr = cleaned_ingredient.split(" ");
                if (cleaned_ingredient_arr.length > 2) {
                    cleaned_ingredient_arr = cleaned_ingredient_arr.slice(0, 2);
                }
                console.log(cleaned_ingredient_arr.join(" "));
            }
        }
        console.log(`Cleaned up ${recipes.length} recipes.`);
    });
}

getRecipes();