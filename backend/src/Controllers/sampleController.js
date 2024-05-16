const SampleModel = require("../Models/sampleModel");

const SampleController = {
    sample: async (req, res, next) => {
        try {
            const { city, salary, skill, exp, form } = req.query;
            const currentDate =new Date()  
            const getPost = await SampleModel.find({status:true, duration: { $gte: currentDate }}).populate('CO').sort({ createdAt: -1 });
            const filteredPosts = getPost.filter(post => { 
                let cityFilter;
                if (city === "Tất cả mọi nơi") {
                cityFilter = true; 
                } else if (city === "Khác") {
                cityFilter = !["Hồ Chí Minh", "Hà Nội","Đà Nẵng"].includes(post.address.city);
                } else {
                cityFilter = post.address.city === city;
                }         
                const salaryFilter = post.salaryfrom <= salary[1] && salary[0] <= post.salaryto 
                const skillFilter = skill===undefined|| skill.some(s => post.tag.skill.includes(s)) 
                const expFilter = exp===undefined|| exp.some(s => post.tag.exp.includes(s))
                const formFilter = form===undefined|| form.some(f => post.form.includes(f))
                return salaryFilter && skillFilter && expFilter && formFilter  && cityFilter
            });
            return res.status(200).json({
                success: true,
                data: filteredPosts,
            });
        } catch (error) {
            return res.status(500).json({
            success: false,
            message: error.message,
            });
        }
    },

    sample2: async (req, res, next) => {
   
        try {
            const  { iduser } = req.query
            const test = req.params.test
        
            const result = await userModel.aggregate([
              {
                $match: {
                  "_id": new mongoose.Types.ObjectId(iduser)
                }
              },
              {
                $lookup: {
                  from: "cvs",
                  localField: "_id",
                  foreignField: "idUser",
                  as: "user_cv"
                }
              },
              {
                $unwind: "$user_cv"
              },
              {
                $lookup: {
                  from: "applications",
                  localField: "user_cv._id",
                  foreignField: "cvId",
                  as: "apply"
                }
              },
              {
                $unwind: "$apply"
              },
              {
                $lookup: {
                  from: "posts",
                  localField: "apply.postId",
                  foreignField: "_id",
                  as: "post"
                }
              },
              {
                $unwind: "$post"
              },  
              {
                $lookup: {
                  from: "cos",
                  localField: "post.CO",
                  foreignField: "_id",
                  as: "co_info"
                }
              },
              {
                $unwind:"$co_info"
              },
              {
                $sort: {
                  "apply.createdAt": -1 // Sắp xếp theo createdAt, -1 là giảm dần (tức là mới nhất đến cũ nhất)
                }
              }
            ])
            const populatedResult = await userModel.populate(result, {
              path: "post.CO", // Đường dẫn tới trường coId trong posts
              model: "COs" // Tên của model CO
            });
            return res.status(200).json({
              success: true,
              data:populatedResult
            });
          } catch (error) {
            console.log(error)
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }
    }
}

module.exports = SampleController;
