"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const api_url = "https://masak-apa-tomorisakura.vercel.app/api";
function getRecipeDetail(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${api_url}/recipe/${key}`);
        return response.data;
    });
}
function getRecipes() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let error = false;
        let recipes_key = [];
        let i = 0;
        let max = 10000;
        let arr = Array(1000).fill(0);
        try {
            for (var arr_1 = __asyncValues(arr), arr_1_1; arr_1_1 = yield arr_1.next(), !arr_1_1.done;) {
                const r = arr_1_1.value;
                console.log(`Getting recipes page ${i}...`);
                yield axios_1.default.get(`${api_url}/recipes/${i}`).then((response) => __awaiter(this, void 0, void 0, function* () {
                    const recipes = response.data.results;
                    for (let i = 0; i < recipes.length; i++) {
                        const recipe = recipes[i];
                        if (!recipes_key.includes(recipe.key)) {
                            console.log(`Getting recipe ${recipe.key}...`);
                            const recipe_detail = yield getRecipeDetail(recipe.key);
                            fs.appendFileSync("data.json", JSON.stringify(recipe_detail.results));
                            recipes_key.push(recipe.key);
                        }
                        else {
                            console.log("Recipe already exists");
                        }
                    }
                    i++;
                })).catch((err) => error = true);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (arr_1_1 && !arr_1_1.done && (_a = arr_1.return)) yield _a.call(arr_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
const words_to_remove = [
    "[^a-zA-Z ]+",
    "sdm", "sdt", "buah", "siung", "lembar daun", "lembar", "kecil",
    " g ", "mg", "cm", " ml", " L ", " kg", "gr", " x", "butir", "ekor", "sedang", "memanjang", "porsi",
    "rendam air", "selama", "jam ", "mendidih", "ukuran", "bungkus", "merebus", "korek", " api", "olesan", "menggoreng",
    "seduh", "cincang", "untuk", "menumis", "bagian", "potong", "iris", "tipis", "haluskan", "dadu", "halus"
];
const regex = new RegExp(`(${words_to_remove.join("|")})`, "gi");
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        fs.readFile("data.json", (err, data) => {
            if (err) {
                console.log(err);
            }
            const recipes = JSON.parse(data.toString());
            const cleaned_data = [];
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
    });
}
getRecipes();
