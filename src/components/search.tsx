
import * as React from "react";
import * as Radium from "radium";
import { getInfo } from "ytdl-core";
import { FocusEvent } from "react";

const style = {
    search: {
        position: "relative" as "relative",
        height: "55px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        padding: "10px 30px",
        borderLeft: "solid 1.5px rgba(0, 0, 0, 0.5)",
        borderBottom: "solid 1.5px rgba(0, 0, 0, 0.5)",
        overflow: "hidden" as "hidden",
        ":focus>.icon": {
            transform: "rotateZ(45) scale(1.5)"
        }
    },
    icon: (rotation: number = 0) => {return{
        position: "absolute" as "absolute",
        right: "20px",
        lineHeight: "55px",
        verticalAlign: "center",
        height: "55px",
        fontSize: "100px",
        color: "rgba(255,255,255,0.15)",
        transition: "transform 0.5s ease-in",
        transform: `rotateZ(${rotation}deg)`
    }},
    input: {
        height: "22px",
        width: "100%",
        paddingTop: "17px",
        lineHeight: "20px",
        background: "transparent",
        fontSize: "20px",
        fontFamily: "Montserrat, bold",
        color: "#e0e2e4",
        border: "none",
        verticalAlign: "bottom",
        ":focus": {
            outline: "none"
        }
    }
}

export interface SearchProps {
    onSearching: (value: string) => void;
    onFound: (id: string, filename: string, title: string, thumbnail: string) => void;
}

export interface SearchState {
    rotation: number;
}

export const Search = Radium(class extends React.Component<SearchProps, SearchState> {
    private waitTimer: number|null = null;
    private spinTimer: number|null = null;
    
    constructor(props: SearchProps) {
        super(props);
        this.state = {
            rotation: 0
        };
    }

    spinIcon(to?: number) {
        this.setState({
            rotation: to !== undefined ? to : this.state.rotation + 360
        });
    }

    async handleFocus(e: FocusEvent<HTMLInputElement>) {
        this.spinIcon(-90);
    }

    async handleBlur(e: FocusEvent<HTMLInputElement>) {
        this.spinIcon(0);
    }

    async handleChange(e: {target: any}) {
        const val = e.target.value;
        
        if (this.waitTimer !== null) {
            clearTimeout(this.waitTimer);
        }

        await new Promise(resolve => {
            this.waitTimer = setTimeout(resolve, 200);
        })

        if (this.spinTimer) clearInterval(this.spinTimer);
        this.spinTimer = setInterval(this.spinIcon.bind(this), 500);

        try {
            this.props.onSearching(val);
            const info = await getInfo(val);
            this.props.onFound(info.video_id, info.video_id, info.title, info.thumbnail_url);
        } catch(err) {
        }

        if (this.spinTimer) clearInterval(this.spinTimer);
        (async () => this.spinIcon(0))();
    }

    render() {
        return (
            <div style={style.search}>
                <i style={style.icon(this.state.rotation)} className="fa fa-search" aria-hidden="true"></i>
                <input 
                    placeholder="Youtube URL..."
                    style={style.input}
                    onChange={this.handleChange.bind(this)}
                    onFocus={this.handleFocus.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                />
            </div>
        );
    }
});