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
        type:Number,
        default:0
    },
    images:[
        {
            filename:{
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
                'rayon','fabric','cloth','gsm'                            
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
        maxlength:[5,"products stock cannot exceed 5"]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
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
    ]
})

const product=mongoose.model('products',modelSchema)
module.exports=product