import { Helmet } from "react-helmet-async"

const Metadata=({title})=>{
    return(
        <Helmet>
            <title>{` ${title} - Sk Textile`}</title>
        </Helmet>
    )
}
export default Metadata