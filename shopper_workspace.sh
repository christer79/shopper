i3-msg 'workspace 2; exec code projects-2019/shopper'
sleep 5
i3-msg 'workspace 4; exec google-chrome'
sleep 3
i3-msg 'workspace 1;'
urxvt -cd ~/projects-2019/shopper/frontend &
urxvt -cd ~/projects-2019/shopper/backend &
urxvt -cd ~/projects-2019/shopper/postgres &
i3-msg 'layout stacking'



