import { using } from "./ModClasses.js";

using("Terraria");
using("Terraria.ID");
using("Terraria.Chat");
using("Microsoft.Xna.Framework");
using("Microsoft.Xna.Framework.Graphics");

let NewCombatText =
    CombatText[
        "int NewText(Rectangle location, Color color, string text, bool dramatic, bool dot)"
    ];

let fortune = 0;

ChatCommandProcessor.ProcessIncomingMessage.hook(
    (original, self, message, client_id) => {
        original(self, message, client_id);

        const command = message.Text.toUpperCase();
        if (command.startsWith("/FORTUNE")) {
            const fortuneValue = parseInt(command.split(" ")[1]);
            if (!isNaN(fortuneValue)) {
                fortune = fortuneValue;
                NewCombatText(
                    Main.player[0].getRect(),
                    Color.Blue,
                    `Ores to be duplicated ${fortune}`,
                    true,
                    false
                );
            }
        }
    }
);

WorldGen.PlaceTile.hook((original, i, j, Type, mute, force, plr, stly) => {
    if (TileID.Sets.Ore[Type]) {
        Main.player[0].HeldItem.stack -= fortune;
    }

    original(i, j, Type, mute, false, plr, stly);
});

WorldGen.KillTile_DropItems.hook(
    (original, x, y, tileCache, includeLargeObjectDrops) => {
        original(x, y, tileCache, false);

        if (TileID.Sets.Ore[tileCache.type]) {
            for (let i = 1; i < fortune; i++) {
              if (fortune !== 0) original(x, y, tileCache, false);
            }
        }
    }
);
