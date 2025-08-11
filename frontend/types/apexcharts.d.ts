declare module 'vue3-apexcharts' {
  const VueApexCharts: any
  export default VueApexCharts
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      apexchart: any
    }
  }
}