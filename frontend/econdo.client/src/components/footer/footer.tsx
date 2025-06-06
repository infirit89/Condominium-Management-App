import { AppShellFooter, Container, Group, Text } from "@mantine/core";
import Link from "next/link";

export function Footer() {
    return (
        <AppShellFooter pos={'relative'} py="md" mt="xl" bg="gray.0" style={{ borderTop: '1px solid #dee2e6' }}>
            <Container size="lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text size="sm" c="dimmed">
                    © {new Date().getFullYear()} ECondo. All rights reserved.
                </Text>
                <Group gap="md">
                    <Text size="sm" c="dimmed" component={Link} href="/privacyPolicy">
                        Privacy Policy
                    </Text>
                    <Text size="sm" c="dimmed" component={Link} href="/termsOfService">
                        Terms of Service
                    </Text>
                    <Text size="sm" c="dimmed" component={Link} href="/support">
                        Support
                    </Text>
                </Group>
            </Container>
        </AppShellFooter>
    );
}
