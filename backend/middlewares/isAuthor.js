const isAuthor = async (req, res, next) => {
  try {
    const modelName = req.baseUrl.includes('/comments')
      ? 'Comment'
      : req.baseUrl.includes('/replies')
      ? 'Reply'
      : 'Post';
    const Model = require(`../models/${modelName}.js`);
    const idParamsName = req.baseUrl.includes('/comments')
      ? 'commentId'
      : req.baseUrl.includes('/replies')
      ? 'replyCommentId'
      : 'postId';
    const resourceId = req.params[idParamsName];

    const resource = await Model.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ message: `${modelName} not found.` });
    }

    if (resource.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    next();
  } catch (error) {
    console.error(`Error in isAuthor middleware: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = isAuthor;
