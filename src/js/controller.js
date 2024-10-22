import * as model from './modal.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (model.hot) {
//   model.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // 0.update result view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    //1. Updating the bookmark
    bookmarksView.update(model.state.bookmarks);
    //2.Loading Recipe

    await model.loadRecipe(id);

    //  3.Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    // 1.get search Query
    const query = searchView.getQuery();
    if (!query) return;
    // 2. Load Search results
    await model.loadSearchResult(query);
    // 3. Render Result
    resultView.render(model.getSearchResultsPage());

    // 4.Render Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = goToPage => {
  // 1. Render  NEW Result
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2. Render  NEW Pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServing) {
  // Update the recipe servings
  model.updateServings(newServing);
  // update the recipe view
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe);
};
const controlAddBookmark = function () {
  // Add or Remove the bookmark

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  // Update recipe view
  recipeView.update(model.state.recipe);
  // Render bookmark
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();
    // Render Bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    window.history.back();
    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
