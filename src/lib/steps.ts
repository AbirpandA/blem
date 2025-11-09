import { Step, StepType } from '@/types';

export function parseXml(response: string): Step[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response, "application/xml");
    const artifact = xmlDoc.getElementsByTagName("boltArtifact")[0];
    
    const steps: Step[] = [];
    let stepId = 1; 
    if (artifact) {
        const artifactTitle = artifact.getAttribute("title") || "Artifact";
        steps.push({
            id: stepId++,
            title: artifactTitle,
            description: "",
            type: StepType.CreateFolder, // Assuming artifact represents a folder creation
            status: "pending"
        });
        
        const actions = artifact.getElementsByTagName("boltAction");
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const actionType = action.getAttribute("type");
            const filePath = action.getAttribute("filePath") || "";
            const codeContent = action.textContent?.trim() || "";
            
            if (actionType === "file") {
                steps.push({
                    id: stepId++,
                    title: `Create ${filePath}`,
                    description: "",
                    type: StepType.CreateFile,
                    status: "pending",
                    code: codeContent,
                    path: filePath
                });
            }
            else if (actionType === "shell") {
                steps.push({
                    id: stepId++,
                    title: `Run command`,
                    description: "",
                    type: StepType.RunScript,
                    status: "pending",
                    code: codeContent
                });
            }
        }
    }
    
    return steps;
  }