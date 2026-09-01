<script lang="ts">
	import { List, ListItem } from './index.js';
</script>

<List variant="decimal" start={3}><ListItem>Third</ListItem></List>
<List variant="disc"><ListItem>Bullet</ListItem></List>
<List dividers><ListItem>Divided</ListItem><ListItem>Again</ListItem></List>
<List><ListItem icon="info">With icon</ListItem></List>
