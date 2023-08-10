import * as Api from './api/index';
import * as Utils from './utils/index';

function init() {
    Api.loadEpisodes(1).then(({ episodes }) => {
        Utils.renderEpisodes(episodes);
        Utils.setupLoadMoreButton();
        Utils.setupHeaderVideo();
    });
}

init();

