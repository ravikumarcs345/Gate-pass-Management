const mongoose=require('mongoose')
const modelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter products name"],
        trim:true,
        maxLength:[100,"name cannot be exceed 100 characters"]
        },
    price:{
        type:Number,
        required:true,
        default:0.0
    },
    description:{
        type:String,
        required:[true,"Enter the products description"]
    },
    rating:{
        type:String,
        default:0
    },
    images:[
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true, "Please enter category"],
        enum:{
            values:[
                'Cotton','Rayon','Canvas','Handloom-Fabrics','Canvas-Cotton','Rayon-Melange'                            
            ],
            message:"Please select correct category"
        }      
    },
    seller:{
        type:String,
        required:[true,"Please enter poducts seller"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter stock"],
        maxlength:[20,"products stock cannot exceed 20"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ], createdAt:{
        type: Date,
        default: Date.now()
    }
})

const product=mongoose.model('products',modelSchema)
module.exports=product