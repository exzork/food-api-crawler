export interface Result {
    title: string;
    thumb: string;
    key: string;
    times: string;
    serving: string;
    difficulty: string;
}

export interface RecipesRequest {
    method: string;
    status: boolean;
    results: Result[];
}

export interface Author {
    user: string;
    datePublished: string;
}

export interface NeedItem {
    item_name: string;
    thumb_item: string;
}

export interface Results {
    title: string;
    thumb: string;
    servings: string;
    times: string;
    difficulty: string;
    author: Author;
    desc: string;
    needItem: NeedItem[];
    ingredient: string[];
    step: string[];
}

export interface RecipeDetail {
    method: string;
    status: boolean;
    results: Results;
}