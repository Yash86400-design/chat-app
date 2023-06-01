const Chatroom = require('../models/chatroom/Chatroom');
const listOfChats = require('../models/listofchats/ListOfChats');
const AuthUser = require('../models/user/User');

class SearchService {
  async getSuggestedTerms(partialQuery, userId) {
    // retrieve a list of suggested search terms based on the partial query
    const regex = new RegExp(`^${partialQuery}`, 'i');

    // const allUserNames = await listOfChats.find({ name: regex, roomId: { $ne: userId.toString() } }).distinct('name');
    const allUserIds = await listOfChats.find({ name: regex, roomId: { $ne: userId.toString() } });

    const lowercaseQuery = partialQuery.toLowerCase();

    const suggestedTerms2 = await Promise.all(
      allUserIds.map(async (user) => {
        const additionalInfo = [];

        if (user.type === 'User') {
          const authUser = await AuthUser.findById(user.roomId).select('name avatar bio');
          additionalInfo.push({
            name: authUser.name,
            id: authUser.id,
            avatar: authUser.avatar,
            bio: authUser.bio
          });
        } else if (user.type === 'Chatroom') {
          const chatroom = await Chatroom.findById(user.roomId).select('name avatar description');
          additionalInfo.push({
            name: chatroom.name,
            id: chatroom.id,
            avatar: chatroom.avatar,
            bio: chatroom.description
          });
        }

        return additionalInfo;
      })
    );

    // const suggestedTerms = allUserNames.filter(name => name.toLowerCase().indexOf(lowercaseQuery) === 0);
    const suggestedTerms = allUserIds.filter(user => user.name.toLowerCase().indexOf(lowercaseQuery) === 0);

    return suggestedTerms2;
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