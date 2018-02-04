
import * as React from "react";
import * as Radium from "radium";

import { Header } from "./header";
import { Search, SearchResult } from "./search";
import { VideoList } from "./videolist";
import { VideoEntry, IVideoEntry, VideoStatus } from "./videoentry";

const style = {
    container: {
        background: "linear-gradient(to bottom, #AD2332 150px, #232323 150px)",
        width: "100vw",
        height: "100vh",
        transition: "padding 0.4s",
        paddingLeft: "100px",
        paddingTop: "75px",
        paddingRight: "100px",
        paddingBottom: "75px",
        boxSizing: "border-box",
        "@media screen and (max-height: 980px)": {
            paddingTop: "0px",
            paddingBottom: "0px"
        },
        "@media screen and (max-width: 1080px)": {
            padding: 0
        }
    },
    app: {
        minWidth: "500px",
        maxWidth: "1150px",
        width: "100%",
        height: "100%",
        backgroundColor: "#18191A",
        marginLeft: "50%",
        transform: "translateX(-50%)",
        border: "solid 0.5px rgba(255, 255, 255, 0.1)",
        fontSize: "12px",
        fontFamily: "Montserrat, bold",
        boxShadow: "0px 5px 20px -6px rgba(0, 0, 0, 0.4)",
        display: "grid",
        gridTemplateColumns: "200px auto",
        gridTemplateRows: "75px auto 75px",
        backgroundImage: "url(./img/Background_cropped.png",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "calc(0% - 200px) calc(100% + 200px)",
        backgroundSize: "contain",
    }
}

export interface AppState {
    entries: SearchResult[];
    settings: {
        autodownload: boolean;
        autoconvert: boolean;
    }
}

export const App = Radium(class extends React.Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            entries: [],
            settings: {
                autodownload: true,
                autoconvert: true
            }
        }
    }

    handleSearching(value: string) {
    }

    handleFound(result: SearchResult) {
        if ( this.state.entries.find(e => e.id === result.id) !== undefined ) {
            return;
        }
        console.log(result);
        const entries = this.state.entries.slice();
        entries.push(result);
        this.setState({entries});
    }

    handleStatusUpdate(video: IVideoEntry, status: VideoStatus) {
        switch (status) {
            case VideoStatus.added: this.state.settings.autodownload && video.download(); break;
            case VideoStatus.downloaded: this.state.settings.autoconvert && video.convert(); break;
            default: break;
        }
    }

    render() {
        return (
            <Radium.StyleRoot style={style.container}>
                <div style={style.app}>
                    <Header name="toob.host" />
                    <Search 
                        onSearching={this.handleSearching.bind(this)}
                        onFound={this.handleFound.bind(this)}
                    />
                    <VideoList>
                        { this.state.entries.map(entry => 
                            <VideoEntry 
                                key={entry.id}
                                ref={entry.id}
                                id={entry.id}
                                title={entry.title} 
                                filename={entry.filename} 
                                thumbnail={entry.thumbnail}
                                file={entry.file} 
                                onStatusUpdate={this.handleStatusUpdate.bind(this)}
                            />
                        ) }
                    </VideoList>
                </div>
            </Radium.StyleRoot>
        );

    }
});