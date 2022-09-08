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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const api_url = "https://masak-apa-tomorisakura.vercel.app/api";
const int = 100;
const data = [];
for (let i = 0; i < int; i++) {
    axios_1.default.get(`${api_url}/recipes/${i}`).then((recipes_data) => {
        const recipes = recipes_data.data;
        for (let j = 0; j < recipes.results.length; j++) {
            axios_1.default.get(`${api_url}/recipe/${recipes.results[j].key}`).then((recipe_detail_data) => {
                const recipe_detail = recipe_detail_data.data;
                data.push(recipe_detail.results);
            });
        }
    });
}
fs.writeFile("data.json", JSON.stringify(data), (err) => {
    if (err) {
        console.log(err);
    }
});
