# installation of arch with sway

## installing arch

### 1. verify stuff

1. verify efivars `ls /sys/firmware/efi/efivars`
2. check netowrk interface `ip link`
3. test connection `ping archlinux.org`
4. check system clock `timedatectl`

### 2. partition disks

show disks `fdisk -l`
parition with `cfdisk`:
1. 512 MiB to boot
2. 16 GiB to swap
3. rest to file system

### 3. format partitions

1. `mkfs.ext4 /dev/root_partition`
2. `mkswap /dev/swap_partition`
3. `mkfs.fat -F 32 /dev/efi_partition`

### 4. mount file systems

1. `mount /dev/root_partition /mnt`
2. `mount --mkdir /dev/efi_partition /mnt/boot`
3. `swapon /dev/swap_partition`

### 5. install essential packages
1. `pacstrap -K /mnt base base-devel linux man nano zsh`

### 6. configure the system

1. `genfstab -U /mnt >> /mnt/etc/fstab`
2. check that `/mnt/etc/fstab` has all 3 partitions correctly listed

### 7. chroot

1. `arch-chroot /mnt`

### 8. select mirrors

1. `pacman -S reflector`
2. `reflector --latest 5 --sort rate --save /etc/pacman.d/mirrorlist`

### 9. set stuff up

1. `ln -sf /usr/share/zoneinfo/US/Mountain /etc/localtime`

2. `hwclock --systohc`

3. `nano /etc/locale.gen` and uncomment `en_US.UTF-8`

4. run `locale-gen`

5. create `/etc/locale.conf` and add `LANG=en_US.UTF-8`

6. create `/etc/hostname` and add the host name as only line in the file

### 10. network config

1. pacman -S networkmanager
2. `cd` into /etc/ and do `systemctl enable NetworkManager`

### 11. set password

1. `passwd`

### 12. set up boot loader

1. `pacman -S grub efibootmgr`
2. `grub-install --target=x86_64-efi --efi-directory=/boot`
3. `grub-mkconfig -o /boot/grub/grub.cfg`

### 13. reboot

1. `exit` out of chroot
2. `umount -R /mnt`
3. `reboot`

### 14. login to root

1. `nano /etc/pacman.conf` and uncomment `# before ParallelDownloads = 5`

2. maybe uncomment `[multilib]`
2. `include=/etc/pacman.d/mirrorlist`

### 15. add users

1. `useradd -m -g users -G audio,video,network,wheel,storage,rfkill -s /usr/bin/zsh seth`

2. `passwd seth`

3. `EDITOR=nano visudo` and uncomment `%wheel ALL=(ALL) ALL`

4. then `exit`

## installing sway
followed [this](https://zenn.dev/haxibami/articles/wayland-sway-install) article
### setting up
[This](https://github.com/swaywm/sway/wiki) is the guide to follow for configuring Sway basic stuff like
- start sway on login shell
- set resolution
### troubleshooting
do `pacman -S sway xorg-xwayland qt5-wayland`
- make sure `seatd` service is started
- add user to seat group

## waybar
https://github.com/Alexays/Waybar
