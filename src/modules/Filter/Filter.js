import './filter.css';
import { capitaliseFirst } from '../../resources/utilities';
import categories from "../../resources/categories.json"
import areas from "../../resources/areas.json"
import NewAdButton from '../NewAdButton/NewAdButton';


export default function Filter(props) {

    // Lager dataen fra categories om til radio buttons
    const categorySelector = categories.map(cat => 
        {   
            return (
                <div key={cat}>
                    <input type='radio' name='category' value={cat} onChange={props.handleChange} /> {capitaliseFirst(cat)}
                </div>
            )
        })

    // Lager dataen fra areas om til radio buttons
    const areaSelector = areas.map(area => 
        {   
            return (
                <div key={area}>
                    <input type='radio' name='area' value={area} onChange={props.handleChange} /> {capitaliseFirst(area)}
                </div>
            )
        })



    return (
        <div className='content' >
            <div className={`${!props.currentUser && 'hidden'}`}>
                <NewAdButton 
                    currentUser={props.currentUser}
                />
                <h3>Vis kun mine auksjoner</h3>    
                <div>
                    <input type='radio' name='myads' value='ja' onChange={props.handleChange} /> Ja
                    <input type='radio' name='myads' value='nei' onChange={props.handleChange} defaultChecked /> Nei
                </div>
            </div>
            <h3>Kategorier</h3>    
            <div>
                <input type='radio' name='category' value='alle' onChange={props.handleChange} defaultChecked /> Alle
            </div>
            {categorySelector}
                    
            <h3>Område</h3>
            <div  className='scroll'>
                <div >
                    <input type='radio' name='area' value='alle' onChange={props.handleChange} defaultChecked /> Alle
                </div>
                {areaSelector}
            </div>
        </div>
    )
}
