const listOfChats = require('../models/listofchats/ListOfChats');

class SearchService {
  async getSuggestedTerms(partialQuery) {
    // retrieve a list of suggested search terms based on the partial query
    const regex = new RegExp(`^${partialQuery}`, 'i');
    const matchingNames = await listOfChats.find({ name: regex }).distinct('name');
    const lowercaseQuery = partialQuery.toLowerCase();
    const suggestedTerms = matchingNames.filter(name => name.toLowerCase().startswith(lowercaseQuery));
    return suggestedTerms;
  }

  async getSearchResults(query) {
    // retrieve the search results based on the query
    const lowercaseQuery = query.toLowerCase();
    const results = await listOfChats.find({ name: lowercaseQuery });
    const searchResults = results.map(result => result.toObject());
    return searchResults;
  }
}

module.exports = new SearchService();