const Products = ({ result }) => {
  const [photos, music] = result; // Destructure the array into photos and music

  return (
    <>
      {/* Photo Cards */}
      <section className="flex flex-wrap ml-80 mt-8 max-w-5xl">
        {photos}
      </section>

      {/* Audio Cards */}
      <section className="flex flex-wrap ml-80 mt-8 max-w-5xl">
        {music}
      </section>
    </>
  );
};

export default Products;
