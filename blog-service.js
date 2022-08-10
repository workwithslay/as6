const Sequelize = require('sequelize');
var sequelize = new Sequelize('d27hbsq7uhdfrh', 'lhxfnelrjsfqjo', '298d365fd70a830ac6a97d6dcc01ed468a4b73caf4408310fdec50d1a97d2baf', {
    host: 'ec2-3-225-110-188.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});
var Category = sequelize.define("Category", {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=>{
            resolve();
        }).catch(err=>{
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
};


module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getPostsByMinDate = function (minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        
        Post.findAll({
            where: {
                postDate: {
                    [gte]: new Date(minDateStr)
                }
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getPostById = function (id) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                id: id
            }
        }).then(data=>{
            resolve(data[0]);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.addPost = function (postData) {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (var temp in postData)
        {
            if (postData[temp] === "")
            {
                postData[temp] = null;
            }
        }
        postData.postDate = new Date();

        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("unable to create post");
        });
    });
}


module.exports.getPublishedPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category: category
            }
        }).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.getCategories = function () {
    return new Promise((resolve, reject) => {
        Category.findAll().then(data=>{
            resolve(data);
        }).catch(err=>{
            reject("no results returned");
        });
    });
}

module.exports.addCategory = function (categoryData) {
    return new Promise((resolve, reject)=>{
        for (var temp in categoryData)
        {
            if (categoryData[temp] === "")
            {
                categoryData[temp] = null;
            }
        }

        Category.create(categoryData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to create category");
      });
  });
}

module.exports.deleteCategoryById = function (id) {
    return new Promise((resolve, reject)=>{
        Category.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            resolve();
        }).catch(err=>{
            reject();
        });
    });
}

module.exports.deletePostById = function (id) {
    return new Promise((resolve, reject)=>{
        Post.destroy({
            where: {
                id: id
            }
        }).then(()=>{
            resolve("destroyed");
        }).catch(err=>{
            reject("(was rejected");
        });
    });
}