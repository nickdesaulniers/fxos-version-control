PROFILE_ARG=''

ifdef PROFILE
	PROFILE_ARG = -p $(PROFILE)
endif

run:
	cd addon-sdk && . bin/activate && cd .. && cfx run $(PROFILE_ARG)
