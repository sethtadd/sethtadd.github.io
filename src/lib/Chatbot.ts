import { projectStore, skillsAndExperienceStore } from "$lib/stores";
import { get } from "svelte/store";

export class Chatbot {
    public awaitingAssistantResponse: boolean = false;

    public messages: { role: string; name?: string; content: string; function_call?: { name: any; arguments: any; } }[] = [
        {
            role: "system",
            content:
                "You are an AI assistant named SethGPT. You live in the real Seth's portfolio website and help users interested in Seth's projects get to know him. Do not make up information or hypotheticals about Seth, only use information provided through function calls. If you don't have access to info or don't know the answer, say so. Instead of dumping information onto the user, ask the user more details about what they want to know so that you can narrow down the length your responses to be more concise.",
        },
        {
            role: "system",
            content: "Your job is also to rearrange and emphasize parts of the website for users. You can use function calls to accomplish this.",
        },
        {
            role: "assistant",
            content: "Hi, I'm Seth",
        },
        {
            role: "assistant",
            content:
                "Just kidding! It's not actually me, just my placeholder, SethGPT. BUT! I can tell you all about Seth's interests and skills and direct you to projects he's worked on :)",
        },
        {
            role: "assistant",
            content:
                'Feel free to ask me questions like "show me a random project" or "tell me about his skills"',
        },
    ];

    private function_jsons: any[] = [
        {
            "name": "alert_message",
            "description": "Calls alert() in the browser.",
            "parameters": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The message to be passed to alert().",
                    },
                },
                "required": ["message"],
            },
        },
        {
            "name": "get_cards_layout",
            "description": "Returns the current layout of the cards (which, effectively, compose the website) on the page. The order of the contents is the same as the order of the cards on the page that the user sees. The content of each card is omitted for conciseness, you can use get_card_content to retrieve the content of a specific card.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": [],
            },
        },
        {
            "name": "get_card_content",
            "description": "Returns the content of a specific card. It is recommended to subsequently expand the card using expand_card to emphasize the card you are talking about.",
            "parameters": {
                "type": "object",
                "properties": {
                    "card_title": {
                        "type": "string",
                        "description": "The title of the card whose content you want to retrieve. Case sensitive.",
                    },
                },
                "required": ["card_title"],
            },
        },
        {
            "name": "expand_card",
            "description": "Expands a specific card.",
            "parameters": {
                "type": "object",
                "properties": {
                    "card_title": {
                        "type": "string",
                        "description": "The title of the card you want to expand. Case sensitive.",
                    },
                },
                "required": ["card_title"],
            },
        },
        {
            "name": "collapse_card",
            "description": "Collapses a specific card.",
            "parameters": {
                "type": "object",
                "properties": {
                    "card_title": {
                        "type": "string",
                        "description": "The title of the card you want to collapse. Case sensitive.",
                    },
                },
                "required": ["card_title"],
            },
        },
        {
            "name": "set_project_cards_order",
            "description": "Sets the order of cards in the project section.",
            "parameters": {
                "type": "object",
                "properties": {
                    "project_order": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "An ordered list of project card titles dictating the display order. Titles not in this list will be removed from display."
                    }
                },
                "required": ["project_order"]
            }
        },
    ]

    private functions: { [key: string]: (...args: any[]) => string } = {
        "alert_message": this.alert_message,
        "get_cards_layout": this.getCardsLayout,
        "get_card_content": this.getCardContent,
        "expand_card": this.expandCard,
        "collapse_card": this.collapseCard,
        "set_project_cards_order": this.setProjectCardsOrder,
        "set_skills_and_experience_cards_order": this.setSkillsAndExperienceCardsOrder,
    };


    private getCardsLayout(): string {
        return JSON.stringify({
            projects: get(projectStore).map(card => ({ ...card, content: "" })),
            skillsAndExperience: get(skillsAndExperienceStore).map(card => ({ ...card, content: "" }))
        });
    }

    private getCardContent(cardTitle: string): string {
        const projectCard = get(projectStore).find(card => card.title === cardTitle);
        if (projectCard) return projectCard.content;

        const skillsAndExperienceCard = get(skillsAndExperienceStore).find(card => card.title === cardTitle);
        if (skillsAndExperienceCard) return skillsAndExperienceCard.content;

        return "Card not found.";
    }

    private expandCard(cardTitle: string): string {
        let cardFound = false;

        projectStore.update(projects => {
            return projects.map(card => {
                if (card.title === cardTitle) {
                    cardFound = true;
                    return { ...card, isExpanded: true };
                }
                return card;
            });
        });

        if (cardFound) return `Expanded card ${cardTitle}.`;

        skillsAndExperienceStore.update(skillsAndExperience => {
            return skillsAndExperience.map(card => {
                if (card.title === cardTitle) {
                    cardFound = true;
                    return { ...card, isExpanded: true };
                }
                return card;
            });
        });

        if (cardFound) return `Expanded card ${cardTitle}.`;
        else return `Card ${cardTitle} not found.`;
    }

    private collapseCard(cardTitle: string): string {
        let cardFound = false;

        projectStore.update(projects => {
            return projects.map(card => {
                if (card.title === cardTitle) {
                    cardFound = true;
                    return { ...card, isExpanded: false };
                }
                return card;
            });
        });

        if (cardFound) return `Collapsed card ${cardTitle}.`;

        skillsAndExperienceStore.update(skillsAndExperience => {
            return skillsAndExperience.map(card => {
                if (card.title === cardTitle) {
                    cardFound = true;
                    return { ...card, isExpanded: false };
                }
                return card;
            });
        });

        if (cardFound) return `Collapsed card ${cardTitle}.`;
        else return `Card ${cardTitle} not found.`;
    }

    private alert_message(message: string): string {
        alert(message);
        return `Done.`;
    }

    private setProjectCardsOrder(projectOrder: string[]): string {
        projectStore.update(cards => {
            return projectOrder.reduce((acc, title) => {
                const foundCard = cards.find(card => card.title === title);
                if (foundCard) {
                    acc.push(foundCard);
                }
                return acc;
            }, [] as typeof cards);
        });

        return "Done.";
    }

    private setSkillsAndExperienceCardsOrder(skillsAndExperienceOrder: string[]): string {
        skillsAndExperienceStore.update(cards => {
            return skillsAndExperienceOrder.reduce((acc, title) => {
                const foundCard = cards.find(card => card.title === title);
                if (foundCard) {
                    acc.push(foundCard);
                }
                return acc;
            }, [] as typeof cards);
        });

        return "Done.";
    }

    constructor(messages?: { role: string; content: string; }[]) {
        if (messages) this.messages = messages;
    }

    public async chatCompletionRequest(
        messages: any[],
        functions?: any,
        functionCall?: any,
        model: string = "gpt-4"
    ): Promise<object> {
        const headers = {
            "Content-Type": "application/json",
        };

        let json_data: any = {
            model: model,
            messages: messages,
        };

        if (functions) {
            json_data.functions = functions;
        }

        if (functionCall) {
            json_data.functionCall = functionCall;
        }

        try {
            const response = await fetch(
                "https://openaiproxy-3j6yohvq7a-uc.a.run.app/sethgpt",
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(json_data),
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error("Network response was not ok");
            }
        } catch (e) {
            console.error("Unable to generate ChatCompletion response");
            console.error(`Exception: ${e}`);
            return Object(e);
        }
    }

    public appendUserMessage(message: string) {
        // TODO dompurify this
        this.messages.push({ role: "user", content: message })
    }

    public async generateResponse(
        model: string = "gpt-4"
    ) {
        try {
            let response: { [key: string]: any } = await this.chatCompletionRequest(this.messages, this.function_jsons);
            // TODO have API forward raw OpenAI response, use this line once that's done
            // response = response["choices"][0];
            let message = response["message"];
            this.messages.push(message);

            // function handling
            if (response["finish_reason"] === "function_call") {
                let func_name = response["message"]["function_call"]["name"];
                let func = this.functions[func_name];
                let func_args = JSON.parse(response["message"]["function_call"]["arguments"]);
                let func_response = func(...Object.values(func_args));
                this.messages.push({
                    role: "function",
                    name: func_name,
                    content: func_response,
                });

                await this.generateResponse();
            } else if (response["finish_reason"] === "stop") {
                // message already appended
            } else {
                console.error("Unhandled finish reason:", response.finish_reason);
            }
        } catch (error) {
            console.error("Error in generateResponse: " + error);
        }
    }
}
