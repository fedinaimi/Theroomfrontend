import React from "react";

const PackPricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      duration: "per month",
      features: ["Feature A", "Feature B", "Feature C"],
    },
    {
      name: "Pro",
      price: "$99",
      duration: "per month",
      features: ["Feature A", "Feature B", "Feature C", "Feature D"],
    },
    {
      name: "Enterprise",
      price: "$199",
      duration: "per month",
      features: ["All Features"],
    },
  ];

  return (
    <section className="pack-pricing bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white py-16 px-8">
      <h2 className="text-4xl font-bold text-center mb-12 text-orange-400 drop-shadow-md">
        Pack Pricing
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`pricing-card ${
              idx === 1 ? "highlighted" : ""
            } bg-gray-900 rounded-lg shadow-lg p-8 hover:scale-105 transition-transform`}
          >
            <h3 className="text-2xl font-semibold mb-4 text-orange-400">
              {plan.name}
            </h3>
            <div className="price-section text-center mb-6">
              <p className="text-5xl font-extrabold text-white">
                {plan.price}
              </p>
              <p className="text-sm text-gray-400">{plan.duration}</p>
            </div>
            <ul className="feature-list text-gray-300 mb-6 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-600 transition-all">
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackPricing;
