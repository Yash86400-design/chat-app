const listOfChats = require('../models/listofchats/ListOfChats');

class SearchService {
  async getSuggestedTerms(partialQuery, userId) {
    // retrieve a list of suggested search terms based on the partial query
    const regex = new RegExp(`^${partialQuery}`, 'i');

    const matchingNames = await listOfChats.find({ name: regex, roomId: { $ne: userId.toString() } }).distinct('name');
    const lowercaseQuery = partialQuery.toLowerCase();
    const suggestedTerms = matchingNames.filter(name => name.toLowerCase().indexOf(lowercaseQuery) === 0);

    return suggestedTerms;
  }

  async getSearchResults(query, userId) {
    // retrieve the search results based on the query
    /*
    const lowercaseQuery = query.toLowerCase();
    const results = await listOfChats.find({ name: lowercaseQuery }).distinct('name');
    const searchResults = results.map(result => result.toObject());
    return searchResults;
    */
    const regex = new RegExp(`^${query}`, 'i');
    const matchingNames = await listOfChats.find({ name: regex, roomId: { $ne: userId.toString() } }).distinct('name');
    const lowercaseQuery = query.toLowerCase();
    const suggestedTerms = matchingNames.filter(name => name.toLowerCase().indexOf(lowercaseQuery) === 0);
    return suggestedTerms;
  }
}

module.exports = new SearchService();