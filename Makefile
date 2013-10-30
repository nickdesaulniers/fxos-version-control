PROFILE_ARG=''

run:
	cd addon-sdk && . bin/activate && cd .. && cfx run $(PROFILE_ARG)
