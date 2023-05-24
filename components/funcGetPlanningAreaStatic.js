//Get static planning area
import PlanningArea from "./PlanningArea.json";

function funcGetPlanningAreaStatic(handler) {

    const apiGetPlanningArea = () => {
        const AreaPolygonData = PlanningArea;
        AreaPolygonData.sort((a, b) => a.pln_area_n.localeCompare(b.pln_area_n))
        const removedOTHERS = AreaPolygonData.filter(area => area.pln_area_n !== "OTHERS")
        handler(removedOTHERS)
        // console.log(AreaPolygonData)
    }

    apiGetPlanningArea();
}

export default funcGetPlanningAreaStatic;