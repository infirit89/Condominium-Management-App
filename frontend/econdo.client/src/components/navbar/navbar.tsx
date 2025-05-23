'use client';
import {
    Anchor,
    AppShellHeader,
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    ScrollArea,
} from "@mantine/core";
import classes from './navbar.module.css';
import { useDisclosure } from "@mantine/hooks";
import { ECondoLogo } from "../logo/econdoLogo";
import Link from "next/link";

export function Navbar() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    return (
        <AppShellHeader>
            <Box>
                <header className={classes.header}>
                    <Group justify="space-between" h="100%">
                    <Anchor component={Link} href="/" pt={4} visibleFrom="sm">
                        <ECondoLogo size={30} />
                    </Anchor>
                    <Anchor component={Link} href="/" pt={3} hiddenFrom="sm">
                        <ECondoLogo type="mark" size={45} />
                    </Anchor>

                    {/* <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="#" className={classes.link}>
                        Начало
                        </a>
                        <a href="#" className={classes.link}>
                        За нас
                        </a>
                        <a href="#" className={classes.link}>
                        Контакти
                        </a>
                    </Group> */}

                    <Group visibleFrom="sm">
                        <Button variant="default" component={Link} href="/login">Вход</Button>
                        <Button component={Link} href="/register">Регистрирай се</Button>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                    </Group>
                </header>

                <Drawer
                    opened={drawerOpened}
                    onClose={closeDrawer}
                    size="100%"
                    padding={"md"}
                    title={
                        <Anchor component={Link} href="/">
                            <ECondoLogo size={40} />
                        </Anchor>
                    }
                    hiddenFrom="sm"
                    zIndex={1000000}
                >
                    <ScrollArea h="calc(100vh - 80px" mx="-md">
                    {/* <Divider my="sm" /> */}

                    {/* <a href="#" className={classes.link}>
                        Начало
                    </a>
                    <a href="#" className={classes.link}>
                        За нас
                    </a>
                    <a href="#" className={classes.link}>
                        Контакти
                    </a> */}

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default" component={Link} href="/login">Вход</Button>
                        <Button component={Link} href="/register">Регистрирай се</Button>
                    </Group>
                    </ScrollArea>
                </Drawer>
            </Box>
        </AppShellHeader>
    )
}