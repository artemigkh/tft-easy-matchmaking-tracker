# TftEasyMatchmakingTracker
A tool for tracking who you are eligible to play in teamfight tactics

## Usage
This tracker is only designed to be launched by the python script in `launcher/tft_tracker_launcher.py`
which will use game logs to automatically populate the list of usernames in your game and launch the
tracker using your default operating system browser.

### Installation
The launcher script requires a python installation with version >= 3.7.
A windows installer can be found at https://www.python.org/downloads/release/python-379/. 

The launcher, `tft_tracker_launcher.py` can be downloaded from the latest github release location: https://github.com/artemigkh/tft-easy-matchmaking-tracker/releases/tag/v1.0
Additionally, a wrapper batch file `start_tft_tracker_latest_game.bat` is provided for a 
"one click launch" on Windows. 

### Starting the Tracker
If your league installation is not at the default `C:\Riot Games\League of Legends` location,
alter the first line of `tft_tracker_launcher.py` to the game logs location of your installation.

Then, it can be started either from the command line with
```
python tft_tracker_launcher.py
```

Or simply by double clicking the `start_tft_tracker_latest_game.bat` file (has to be in the same folder as the python script file)

