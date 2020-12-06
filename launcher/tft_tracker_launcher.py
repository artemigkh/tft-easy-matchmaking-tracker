LEAGUE_CLIENT_LOGS_LOCATION = r'C:\Riot Games\League of Legends'
BASE_URL = 'https://artemigkh.github.io/tft-easy-matchmaking-tracker/'

import glob
import os
import re
import webbrowser
from urllib.parse import quote

find_name_pattern = re.compile(r'CONNECTION READY \| TeamOrder [0-7]\)\s*(.*?)\s*- Champion\(TFTChampion\) SkinID\(0\)')


def parse_r3d_log(path_to_log):
    player_names = []
    with open(path_to_log) as log:
        line = log.readline()
        while line:
            matches = find_name_pattern.search(line)
            if matches and '**LOCAL**' not in matches.group(1):
                player_names.append(matches.group(1))
            if len(player_names) == 7:
                return player_names
            line = log.readline()


def open_tracker_in_browser(player_names):
    encoded_player_list = quote(','.join(player_names))
    url = '{}?players={}'.format(BASE_URL, encoded_player_list)
    webbrowser.open(url)


def get_latest_game_log_path():
    r3d_logs = glob.glob('{}\\Logs\\GameLogs\\*\\*_r3dlog.txt'.format(LEAGUE_CLIENT_LOGS_LOCATION))
    return max(r3d_logs, key=os.path.getctime)


def main():
    open_tracker_in_browser(parse_r3d_log(get_latest_game_log_path()))



if __name__ == '__main__':
    main()
