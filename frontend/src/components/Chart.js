// components/Chart.js

/**
 * Build configuration for a Pie chart given an object with category: amount pairs.
 * Example of dataObject: { Food: 250, Transport: 100, Entertainment: 300 }
 */
export function buildPieConfig(dataObject) {
  const labels = Object.keys(dataObject);
  const values = Object.values(dataObject);

  return {
    labels,
    datasets: [
      {
        label: "Expense Distribution",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FFA500",
        ],
      },
    ],
  };
}

/**
 * Build configuration for a Line chart given an object with weekName: spending pairs.
 * Example of dataObject: { "Week 1": 550, "Week 2": 450, "Week 3": 650 }
 */
export function buildLineConfig(dataObject) {
  const labels = Object.keys(dataObject);
  const values = Object.values(dataObject);

  return {
    labels,
    datasets: [
      {
        label: "Spending Over Time",
        data: values,
        fill: false,
        borderColor: "#4BC0C0",
        tension: 0.2,
      },
    ],
  };
}
