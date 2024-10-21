import "./Product.css";

const Products = ({ result }) => {
  const [photos, music] = result; // Destructure the array into photos and music

  return (
    <>
      <section className="card-container">
        {photos} {/* Display filtered photo cards */}
      </section>
      <section className="card-container">
        {music} {/* Display filtered audio cards */}
      </section>
    </>
  );
};


export default Products; 

//testing
