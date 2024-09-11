import GridLoader from "react-spinners/GridLoader";

const override = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
};

function GridSpinner() {

    return (
        <div className="sweet-loading">
            <GridLoader
                color="blue"
                loading={true}
                cssOverride={override}
                // size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default GridSpinner;