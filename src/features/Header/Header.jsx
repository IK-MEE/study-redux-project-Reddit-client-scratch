import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "../../store/redditSlice";

const Header = () => {
    const dispatch = useDispatch();
    const searchTerm = useSelector( (state) => state.reddit.searchTerm);
    const selectedSubreddit = useSelector(
        (state) => state.reddit.selectedSubreddit
    );

    const onChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
    }

    return (
        <header
            style={{
                padding: '8px 12px',
                borderBottom: '1px solid #ddd',
                marginBottom: '12px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
            }}
        >
            <div style={{ fontWeight: 'bold'}}>
                Reddit Mini . <span style={{ opacity: 0.7}}>{selectedSubreddit}</span>
            </div>

            <input
                type="text"
                placeholder="Search in titles..."
                value={searchTerm}
                onChange={onChange}
                style={{
                    flex: 1,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                }}
            />
        </header>
    );
};

export default Header;